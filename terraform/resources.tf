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
  filename      = "../artifacts/spotify-api.zip"
  function_name = "save-played-tracks"
  role          = aws_iam_role.spt_lambda_role.arn
  handler       = "src/index.savePlayedTracksJobHandler"

  source_code_hash = filebase64sha256("../artifacts/spotify-api.zip")

  runtime = "nodejs14.x"
  timeout = 10
  memory_size = 128

  environment {
    variables = {
      NODE_ENV = "prod"
      REGION = "ap-southeast-2",
      DYNAMODB_ENDPOINT = "TODO",
      SPOTIFY_CLIENT_ID = data.aws_ssm_parameter.spotify_client_id_ssm.value,
      SPOTIFY_CLIENT_SECRET = data.aws_ssm_parameter.spotify_client_secret_ssm.value
    }
  }
}