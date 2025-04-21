pipeline {
    agent {
        docker {
            image 'viiin/terraform-ansible:latest'
            args '--entrypoint="" --user root'
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
                AWS_ACCESS_KEY_ID     = credentials('aws-access-key-tf')
                AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key-tf')
                AWS_REGION            = 'eu-west-1'
                HETZNER_TOKEN = credentials('hetzner_cloud_token')
            }
            steps {
                withCredentials([string(credentialsId: 'public_key', variable: 'PUBLIC_KEY')]) {
                    dir("${INFRA_DIR}") {
                        sh '''
                            echo "$PUBLIC_KEY" > id_ed25519.pub
                            terraform init
                            terraform apply -auto-approve -var "hcloud_token=${HETZNER_TOKEN}"
                        '''
                    }
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
                        ansible-galaxy collection install -r requirements.yaml
                        ansible-playbook -i inventory/hcloud.yaml playbook.yaml -e "api_token=${HETZNER_TOKEN}"
                    '''
                }
            }
        }
    }
}
