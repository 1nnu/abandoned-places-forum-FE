pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }

        stage('Deploy') {
            environment {
                HETZNER_TOKEN = credentials('hetzner_cloud_token')
            }

            steps {
                sh '''
                    apk add --no-cache git ansible openssh terraform

                    git clone https://github.com/1nnu/urbex-infrastructure.git

                    cd urbex-infrastructure
                    echo "$HETZNER_TOKEN" > hetzner_token.txt

                    terraform init
                    terraform apply -auto-approve -var "hcloud_token=$(cat hetzner_token.txt)"

                    ansible-playbook -i inventory.ini playbook.yml
                '''
            }
        }
    }
}
