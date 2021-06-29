// findarkside/dummysite-app:15e7f5ee7a68aa05ee1eea79
const k8s = require('@kubernetes/client-node')
const JSONStream = require('json-stream')
const request = require('request')

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Used to get auth headers for request
const opts = {};
// @ts-ignore
kc.applyToRequest(opts);

const k8sApi = kc.makeApiClient(k8s.CoreV1Api)
const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1beta1Api)
const k8sDeploymentApi = kc.makeApiClient(k8s.AppsV1Api)

/**
 * @param {string} api 
 * @param {import('node-fetch').RequestInit} opts 
 */
async function sendApiRequest(api, opts) {
    return fetch(`${kc.getCurrentCluster().server}${api}`, opts)
        .then(res => res.json)
}

async function init() {
    await watchForDummySiteResources()
}

async function watchForDummySiteResources() {
    // @ts-ignore
    const dummySiteStream = new JSONStream()
    dummySiteStream.on('data', async ({ type, object }) => {
        if (type === 'ADDED') {
            const siteUrl = object.spec.url
            const opts = {
                url: object.spec.url,
                name: object.metadata.name,
                namespace: object.metadata.namespace || 'default'
            }
            try {
                await createServiceIfNotExists(opts)
                await createIngressIfNotExist(opts)
                await createDeploymentIfNotExist(opts)
            } catch (err) {
                console.log(JSON.stringify(err))
            }

        }
    })
    request.get(`${kc.getCurrentCluster().server}/apis/stable.dwk/v1/dummysites?watch=true`, opts).pipe(dummySiteStream)
}

async function createServiceIfNotExists(opts) {
    const services = await k8sApi.listNamespacedService(opts.namespace)
    if (services.body.items.some(service => service.metadata.name === `${opts.name}-svc`))
        return
    await k8sApi.createNamespacedService(opts.namespace, {
        apiVersions: 'v1',
        kind: 'Service',
        metadata: {
            name: `${opts.name}-svc`,
        },
        spec: {
            type: 'ClusterIP',
            selector: {
                app: opts.name,
            },
            ports: [{
                port: 2345,
                protocol: 'TCP',
                // @ts-ignore
                targetPort: 3000,
            }]
        }
    })
}

async function createIngressIfNotExist(opts) {
    const ingresses = await k8sNetworkingApi.listNamespacedIngress(opts.namespace)
    if (ingresses.body.items.some(ingress => ingress.metadata.name === `${opts.name}-ingress`))
        return

    await k8sNetworkingApi.createNamespacedIngress(opts.namespace, {
        apiVersion: 'networking.k8s.io/v1beta1',
        kind: 'Ingress',
        metadata: {
            name: `${opts.name}-ingress`,
        },
        spec: {
            rules: [{
                http: {
                    paths: [{
                        backend: {
                            serviceName: `${opts.name}-svc`,
                            // @ts-ignore
                            servicePort: 2345
                        },
                        path: '/',
                    }]
                }
            }]
        }
    })
}

async function createDeploymentIfNotExist(opts) {
    const deployments = await k8sDeploymentApi.listNamespacedDeployment(opts.namespace)
    if (deployments.body.items.some(deployment => deployment.metadata.name === `${opts.name}-dep`))
        return

    await k8sDeploymentApi.createNamespacedDeployment(opts.namespace, {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            name: `${opts.name}-dep`,
        },
        spec: {
            selector: {
                matchLabels: {
                    app: opts.name
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: opts.name
                    }
                },
                spec: {
                    containers: [{
                        name: 'dummysite-app',
                        image: 'findarkside/dummysite-app:15e7f5ee7a68aa05ee1eea79',
                        env: [{
                            name: 'SITE_URL',
                            value: opts.url
                        }]
                    }]
                }
            }
        }
    })
}

init()