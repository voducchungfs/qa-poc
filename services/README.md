# Services

## auth service

Default port: `9001`

> Get api token

> Validate api token

## domain service

Default port: `9002`

> Get all domains:
- Call `auth service` for validating api token

> Get domain details
- Call `auth service` for validating api token

## customer service

Default port: `9003`

> Get all customers
- Call `auth service` for validating api token

> Get customer details
- Call `auth service` for validating api token
- Call `domain service` for fetching domain details

## API spec: TBD
