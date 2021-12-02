terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      Version = "~>3.27"
    }
  }
  required_version = ">=0.14.9"
}

provider "aws" {
  region = "ap-southeast-2"
  shared_credentials_file = "/Users/dylan/.aws/credentials"
  profile = "digupthehatchet"
  version = "~>3.0"
}