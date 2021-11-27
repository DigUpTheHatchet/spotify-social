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


resource "aws_iam_role" "save_played_tracks_lambda_role" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "save_played_tracks_lambda" {
  filename      = "../builds/spotify-api.zip"
  function_name = "save-played-tracks"
  role          = aws_iam_role.save_played_tracks_lambda_role.arn
  handler       = "src/index.savePlayedTracksJobHandler"

  source_code_hash = filebase64sha256("../builds/spotify-api.zip")

  runtime = "nodejs14.x"
  timeout = 10
  environment {
    variables = {
      foo = "bar"
    }
  }
}