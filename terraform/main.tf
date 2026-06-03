terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.21.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
  shared_credentials_files = ["/Users/dylan/.aws/credentials"]
}
