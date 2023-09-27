terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>4.67.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
  shared_credentials_file = "/Users/dylan/.aws/credentials"
  profile = "digupthehatchet"
}