 node('master') {
    stage('Clearn up'){
       sh label: 'Delete', script: 'rm -f merchant-web-auto-test*' 
    }

    stage('Checkout Git Repo') {
        git credentialsId: 'xxxxxxxxxx',
        branch: 'master',
        url: 'https://github.com/{company_name}/{repo_name}.git'
    }
    
    stage('Install') {
        sh label: 'NPM ci', script: 'npm ci'
    }
        stage('Run test') {
        sh label: 'Cypress Run', script: 'npx cypress run --record --key xxxxxxxxx'
    }
    
}