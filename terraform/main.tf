# terraform {
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~>3.27"
#     }
#   }
#   required_version = ">=0.14.9"
# }

# provider "aws" {
#   region = "ap-southeast-2"
#   shared_credentials_file = "/Users/dylan/.aws/credentials"
#   profile = "digupthehatchet"
#   version = "~>3.0"
# }

# Configure the AWS Provider
provider "aws" {
  version = "~> 3.0"
  region = "ap-southeast-2"
  shared_credentials_file = "/Users/dylan/.aws/credentials"
  profile = "digupthehatchet"
}