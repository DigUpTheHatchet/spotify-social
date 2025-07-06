resource "aws_dynamodb_table" "spotify_tokens_ddb_table" {
  name           = "SpotifyTokens"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "type"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  tags = {
    Name        = "SpotifyTokens"
    Environment = "prod"
  }
}

resource "aws_dynamodb_table" "spotify_users_ddb_table" {
  name           = "SpotifyUsers"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Name        = "SpotifyUsers"
    Environment = "prod"
  }
}

resource "aws_dynamodb_table" "played_tracks_ddb_table" {
  name           = "PlayedTracks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "playedAt"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "playedAt"
    type = "N"
  }

  tags = {
    Name        = "PlayedTracks"
    Environment = "prod"
  }
}

resource "aws_iam_role" "spt_lambda_role" {
  name = "SavePlayedTracksLambdaRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
      "Effect": "Allow",
      "Principal": {
          "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
  }]
}
EOF
}

resource "aws_iam_policy" "spt_lambda_policy" {
  name = "SavePlayedTracksLambdaPolicy"
  description = "Policy for the SavePlayedTracks Lambda Function"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem"
      ],
      "Resource": [
        "${aws_dynamodb_table.played_tracks_ddb_table.arn}",
        "${aws_dynamodb_table.spotify_tokens_ddb_table.arn}",
        "${aws_dynamodb_table.spotify_users_ddb_table.arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "spt_policy_attachment" {
  role       = aws_iam_role.spt_lambda_role.name
  policy_arn = aws_iam_policy.spt_lambda_policy.arn
}

resource "aws_lambda_function" "spt_lambda" {
  filename      = "../artifacts/spotify-social.zip"
  function_name = "save-played-tracks"
  role          = aws_iam_role.spt_lambda_role.arn
  handler       = "src/index.savePlayedTracksJobHandler"

  source_code_hash = filebase64sha256("../artifacts/spotify-social.zip")

  runtime = "nodejs18.x"
  timeout = 15
  memory_size = 128

  environment {
    variables = {
      NODE_ENV = "prod"
      REGION = "ap-southeast-2",
      SPOTIFY_CLIENT_ID = data.aws_ssm_parameter.spotify_client_id_ssm.value,
      SPOTIFY_CLIENT_SECRET = data.aws_ssm_parameter.spotify_client_secret_ssm.value
    }
  }
}

resource "aws_cloudwatch_event_rule" "every_twenty_minutes" {
  name                = "every-twenty-minutes"
  description         = "Fires every 20 minutes"
  schedule_expression = "cron(0/20 * * * ? *)"
}

resource "aws_cloudwatch_event_target" "spt_lambda_every_twenty_minutes" {
  rule      = "${aws_cloudwatch_event_rule.every_twenty_minutes.name}"
  target_id = "lambda"
  arn       = "${aws_lambda_function.spt_lambda.arn}"
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_spt_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.spt_lambda.function_name}"
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.every_twenty_minutes.arn}"
}

resource "aws_iam_role" "rsu_lambda_role" {
  name = "RegisterSpotifyUserLambdaRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
      "Effect": "Allow",
      "Principal": {
          "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
  }]
}
EOF
}

resource "aws_iam_policy" "rsu_lambda_policy" {
  name = "RegisterSpotifyUserLambdaPolicy"
  description = "Policy for the RegisterSpotifyUser Lambda Function"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem"
      ],
      "Resource": [
        "${aws_dynamodb_table.spotify_tokens_ddb_table.arn}",
        "${aws_dynamodb_table.spotify_users_ddb_table.arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "rsu_policy_attachment" {
  role       = aws_iam_role.rsu_lambda_role.name
  policy_arn = aws_iam_policy.rsu_lambda_policy.arn
}

resource "aws_lambda_function" "rsu_lambda" {
  filename      = "../artifacts/spotify-social.zip"
  function_name = "register-spotify-user"
  role          = aws_iam_role.rsu_lambda_role.arn
  handler       = "src/index.registerSpotifyUserHandler"

  source_code_hash = filebase64sha256("../artifacts/spotify-social.zip")

  runtime = "nodejs22.x"
  timeout = 10
  memory_size = 128

  environment {
    variables = {
      NODE_ENV = "prod"
      REGION = "ap-southeast-2",
      SPOTIFY_CLIENT_ID = data.aws_ssm_parameter.spotify_client_id_ssm.value,
      SPOTIFY_CLIENT_SECRET = data.aws_ssm_parameter.spotify_client_secret_ssm.value
    }
  }
}

// TODO: Create a module for these CW alarms
resource "aws_cloudwatch_metric_alarm" "rsu-function-errors" {
  alarm_name                = "register-spotify-user Function Errors"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = "1"
  metric_name               = "Errors"
  namespace                 = "AWS/Lambda"
  period                    = "120"
  statistic                 = "Sum"
  threshold                 = "1"
  alarm_description         = "This metric monitors register-spotify-user function errors"
  treat_missing_data        = "notBreaching"
  dimensions = {
		FunctionName = "${aws_lambda_function.rsu_lambda.function_name}"
	}
  alarm_actions = ["${aws_sns_topic.cloudwatch_alert_topic.arn}"]
}

resource "aws_cloudwatch_metric_alarm" "spt-function-errors" {
  alarm_name                = "save-played-tracks Function Errors"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = "1"
  metric_name               = "Errors"
  namespace                 = "AWS/Lambda"
  period                    = "120"
  statistic                 = "Sum"
  threshold                 = "1"
  alarm_description         = "This metric monitors save-played-tracks function errors"
  treat_missing_data        = "notBreaching"
  dimensions = {
		FunctionName = "${aws_lambda_function.spt_lambda.function_name}"
	}
  alarm_actions = ["${aws_sns_topic.cloudwatch_alert_topic.arn}"]
}

resource "aws_sns_topic" "cloudwatch_alert_topic" {
  name = "cw-alert-topic"
}

resource "aws_sns_topic_subscription" "dylan_email_target" {
  topic_arn = "${aws_sns_topic.cloudwatch_alert_topic.arn}"
  protocol  = "email"
  endpoint  = "dylankelly@live.ie"
}
