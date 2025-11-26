#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const K8S_DIR = path.join(__dirname, '../k8s');

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function extractSubdomain(projectName) {
  const parts = projectName.split('-');
  if (parts.length > 1) {
    return parts.slice(1).join('-');
  }
  return projectName;
}

function updateNamespace(projectName) {
  const filePath = path.join(K8S_DIR, 'namespace.yaml');
  const content = `apiVersion: v1
kind: Namespace
metadata:
  name: ${projectName}-ns
  labels:
    name: ${projectName}-ns
    managed-by: argocd
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated namespace.yaml');
}

function updateConfigMap(projectName) {
  const filePath = path.join(K8S_DIR, 'configmap.yaml');
  const content = `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${projectName}-config
  namespace: ${projectName}-ns
  labels:
    app: ${projectName}
data:
  # API Base URL for backend services
  API_BASE_URL: "https://api.lovetest.com.cn"
  
  nginx.conf: |
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Handle React Router (SPA)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Don't cache index.html
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\\n";
            add_header Content-Type text/plain;
        }
    }
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated configmap.yaml');
}

function updateEnvConfigMap(projectName) {
  const filePath = path.join(K8S_DIR, 'env-configmap.yaml');
  const content = `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${projectName}-env-config
  namespace: ${projectName}-ns
  labels:
    app: ${projectName}
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated env-configmap.yaml');
}

function updateDeployment(projectName, version = '1.0.1') {
  const filePath = path.join(K8S_DIR, 'deployment.yaml');
  const content = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${projectName}
  namespace: ${projectName}-ns
  labels:
    app: ${projectName}
    version: v1
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: ${projectName}
  template:
    metadata:
      labels:
        app: ${projectName}
        version: v1
    spec:
      containers:
      - name: ${projectName}
        image: omaticaya/${projectName}:${version}
        imagePullPolicy: Always
        ports:
        - containerPort: 80
          name: http
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        env:
        - name: NODE_ENV
          value: "production"
        - name: VITE_API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: ${projectName}-config
              key: API_BASE_URL
      restartPolicy: Always
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated deployment.yaml');
}

function updateService(projectName) {
  const filePath = path.join(K8S_DIR, 'service.yaml');
  const content = `apiVersion: v1
kind: Service
metadata:
  name: ${projectName}-service
  namespace: ${projectName}-ns
  labels:
    app: ${projectName}
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: ${projectName}
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated service.yaml');
}

function updateIngress(projectName, subdomain) {
  const filePath = path.join(K8S_DIR, 'ingress.yaml');
  const host = `${subdomain}.lovetest.com.cn`;
  const content = `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${projectName}-ingress
  namespace: ${projectName}-ns
  labels:
    app: ${projectName}
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/gzip-types: "text/plain,text/css,application/json,application/javascript,text/xml,application/xml,application/xml+rss,text/javascript"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - ${host}
    secretName: ${projectName}-tls-secret
  rules:
  - host: ${host}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${projectName}-service
            port:
              number: 80
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated ingress.yaml');
}

function updateHPA(projectName) {
  const filePath = path.join(K8S_DIR, 'hpa.yaml');
  const content = `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${projectName}-hpa
  namespace: ${projectName}-ns
  labels:
    app: ${projectName}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${projectName}
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated hpa.yaml');
}

function updateKustomization(projectName, version = '1.0.1') {
  const filePath = path.join(K8S_DIR, 'kustomization.yaml');
  const content = `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: ${projectName}-ns

metadata:
  name: ${projectName}
  namespace: ${projectName}-ns

resources:
- namespace.yaml
- deployment.yaml
- service.yaml
- ingress.yaml
- configmap.yaml
- env-configmap.yaml
- hpa.yaml

images:
- name: omaticaya/${projectName}
  newTag: ${version}

commonLabels:
  app: ${projectName}
  managed-by: argocd


`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Updated kustomization.yaml');
}

async function main() {
  console.log('🚀 K8s Project Name Updater\n');
  
  // 从命令行参数获取项目名称
  let projectName = process.argv[2];
  
  // 如果没有提供命令行参数，则交互式询问
  if (!projectName) {
    console.log('This script will update all k8s configuration files with a new project name.');
    console.log('Format: <prefix>-<subdomain> (e.g., lovetest-nianshang)\n');
    projectName = await promptUser('Enter the new project name: ');
  }
  
  if (!projectName) {
    console.error('❌ Project name cannot be empty!');
    rl.close();
    process.exit(1);
  }
  
  if (!projectName.includes('-')) {
    console.error('❌ Project name must contain a hyphen (e.g., lovetest-nianshang)');
    rl.close();
    process.exit(1);
  }
  
  const subdomain = extractSubdomain(projectName);
  const host = `${subdomain}.lovetest.com.cn`;
  
  console.log('📝 Configuration Summary:');
  console.log(`   Project Name: ${projectName}`);
  console.log(`   Namespace: ${projectName}-ns`);
  console.log(`   App Label: ${projectName}`);
  console.log(`   ConfigMap: ${projectName}-config`);
  console.log(`   Host: ${host}`);
  console.log(`   Image: omaticaya/${projectName}:1.0.1`);
  
  // 如果是通过命令行参数传入，跳过确认环节
  if (!process.argv[2]) {
    const confirm = await promptUser('\nProceed with these changes? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Operation cancelled.');
      rl.close();
      process.exit(0);
    }
  }
  
  console.log('\n🔄 Updating k8s files...\n');
  
  try {
    updateNamespace(projectName);
    updateConfigMap(projectName);
    updateEnvConfigMap(projectName);
    updateDeployment(projectName);
    updateService(projectName);
    updateIngress(projectName, subdomain);
    updateHPA(projectName);
    updateKustomization(projectName);
    
    console.log('\n✨ All k8s files have been updated successfully!');
    console.log(`\n📦 New configuration:`);
    console.log(`   - Namespace: ${projectName}-ns`);
    console.log(`   - Domain: ${host}`);
    console.log(`   - Image: omaticaya/${projectName}:1.0.1`);
  } catch (error) {
    console.error('❌ Error updating files:', error.message);
    rl.close();
    process.exit(1);
  }
  
  rl.close();
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
