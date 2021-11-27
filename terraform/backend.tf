terraform {
  backend "s3" {
    bucket = "duth-terraform-deploy"
    key    = "spotify-api/spotify-api.tfstate"
    region = "ap-southeast-2"
  }
}