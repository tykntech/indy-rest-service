variable region {
  default = "europe-west6"
}

variable project_name {
}

variable project_id {}

variable org_id {}

variable subdomain {}

variable environment {}

variable keyfilename {}

variable gcp_me_key {
    default = { 
        dev = "",
        prod = "",
        test = ""
    }
}