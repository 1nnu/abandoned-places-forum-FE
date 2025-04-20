pipeline {
    agent {
        dockerContainer {
            image 'hashicorp/terraform:light'
            args '-u root'
        }
    }

    environment {
        INFRA_REPO = 'https://github.com/1nnu/urbex-infrastructure.git'
        INFRA_DIR = 'urbex-infrastructure'
    }

    stages {
        stage('Install Tools') {
            steps {
                sh '''
                    apk update && apk add git ansible bash curl openssh
                '''
            }
        }

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
            environment {
                HETZNER_TOKEN = credentials('hetzner_cloud_token')
            }
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
