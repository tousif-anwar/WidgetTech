# Documentation

## Contents

- [`api/`](api/) — OpenAPI 3.0 specifications for each service's REST API
- [`diagrams/`](diagrams/) — Architecture diagrams (C4 model: context, container, component)

## API Specifications

Each service exposes an OpenAPI spec at `/openapi.json` when running locally. Static copies are checked in here for reference and contract testing.

| Service | Spec |
|---------|------|
| API Gateway | `api/api-gateway.yaml` |
| Auth Service | `api/auth-service.yaml` |
| Product Catalog | `api/product-catalog-service.yaml` |
| Recommendation Engine | `api/recommendation-engine.yaml` |
| Checkout / Order | `api/checkout-order-service.yaml` |
| Payment Integration | `api/payment-integration-service.yaml` |

## Architecture Diagrams

See `diagrams/` for C4-model diagrams:

- `system-context.png` — System context (WidgetAI in relation to sellers, buyers, Stripe)
- `container-diagram.png` — Container diagram (all 12 components)
- `recommendation-component.png` — Component diagram of the recommendation engine
