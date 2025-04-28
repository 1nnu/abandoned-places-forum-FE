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
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key-tf')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key-tf')
        AWS_REGION            = credentials('aws_region')
        HETZNER_TOKEN         = credentials('hetzner_cloud_token')
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
            steps {
                dir("${INFRA_DIR}") {
                    withCredentials([sshUserPrivateKey(credentialsId: 'private_key', keyFileVariable: 'PRIVATE_SSH_KEY')]) {
                        sh '''
                            ansible-galaxy collection install -r requirements.yaml
                            ansible-playbook -i inventory/hcloud.yaml playbook.yaml \
                                -e "api_token=${HETZNER_TOKEN}" \
                                -e "ansible_ssh_private_key_file=$PRIVATE_SSH_KEY"
                        '''
                    }
                }
            }
        }
    }
}
