data "aws_ssm_parameter" "spotify_client_id_ssm" {
  name = "SPOTIFY_CLIENT_ID"
}

data "aws_ssm_parameter" "spotify_client_secret_ssm" {
  name = "SPOTIFY_CLIENT_SECRET"
}