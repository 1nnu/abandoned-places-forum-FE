pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }

        stage('Deploy') {
            agent {
                docker {
                    image 'hashicorp/terraform:light' // Start from a Terraform base
                    args '-u root' // Use root user to install additional tools
                }
            }

            environment { 
                HETZNER_TOKEN = credentials('hetzner_cloud_token') 
            }

            steps {
                echo 'Preparing deployment environment...'

                // Install git and ansible in the container (terraform image is minimal)
                sh '''
                    apk add --no-cache git ansible openssh
                '''

                // Clone the infra repo
                sh 'git clone https://github.com/1nnu/urbex-infrastructure.git'

                dir('urbex-infrastructure') {
                    // Save Hetzner token to file
                    sh 'echo "$HETZNER_TOKEN" > hetzner_token.txt'

                    // Run Terraform
                    sh '''
                        terraform init
                        terraform apply -auto-approve -var "hcloud_token=$(cat hetzner_token.txt)"                    '''

                    // Run Ansible
                    sh '''
                        ansible-playbook playbook.yaml -e "api_token=$(cat hetzner_token.txt)"
                    '''
                }
            }
        }
    }
}
