pipeline {
    agent {
        docker {
            // Use a custom image with both Terraform and Ansible preinstalled
            image 'viiin/terraform-ansible:latest' // <-- Build this if it doesn't exist yet
        }
    }

    environment {
        INFRA_REPO = 'https://github.com/1nnu/urbex-infrastructure.git'
        INFRA_DIR = 'urbex-infrastructure'
    }

    stages {
        stage('Checkout Infra') {
            steps {
                sh '''
                    rm -rf ${INFRA_DIR}
                    git clone ${INFRA_REPO}
                '''
            }
        }

        stage('Terraform Apply') {
            environment {
                HETZNER_TOKEN = credentials('hetzner_cloud_token')
            }
            steps {
                dir("${INFRA_DIR}") {
                    sh '''
                        terraform init
                        terraform apply -auto-approve -var "hcloud_token=${HETZNER_TOKEN}"
                    '''
                }
            }
        }

        stage('Ansible Provision') {
            steps {
                dir("${INFRA_DIR}") {
                    sh '''
                        ansible-playbook playbook.yaml -e "api_token=${HETZNER_TOKEN}"
                    '''
                }
            }
        }
    }
}
