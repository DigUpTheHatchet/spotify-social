terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>3.27"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
  shared_credentials_file = "/Users/dylan/.aws/credentials"
  profile = "digupthehatchet"
}