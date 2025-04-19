pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            environment { 
                AN_ACCESS_KEY = credentials('hetzner_cloud_token') 
            }
            steps {
                echo 'Deploying....'
                sh 'echo $AN_ACCESS_KEY'
            }
        }
    }
}
