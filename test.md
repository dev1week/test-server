status 200
{
status: 'SUCCESS',
code : 'COUPON_ISSUED'
message: '계정 쿠폰이 정상적으로 발급되었습니다.',
data: {
email: 'yuxin.kim@samsung.com',
couponId: 'CP-2026031700001',
couponCode: 'SAVE20MARS26',
expiryDate: '2026-04-30'
}
timestamp:
}

status 409
{
status: 'FAILED',
code : 'COUPON_ALREADY_ISSUED'
message: '계정에게 이미 발급된 쿠폰이 있습니다.',
data: {
email: 'yuxin.kim@samsung.com',
existingCouponId: 'CP-2026031700001',
expiryDate: '2026-04-30'
},
retryable: false
}

status 403
{
status: 'FAILED',
code : 'NO_SAMSUNG_ACCOUNT'
message: '삼성 계정이 등록되지 않은 사용자입니다.',
data: {
email: 'yuxin.kim@samsung.com',
guid: '550e8400-e92b-41d-a716-446655440000'
}
retryable: false
}

status 410

{
status: FAILED',
code : 'COUPON_PERIOD_EXPIRED'
message: '쿠폰 발급 기간이 만료되었습니다.',
retryable: false
}

status 400

{
status: FAILED',
code : 'UNSURPPORTED_COUNTRY'
message: '해당 국가에서는 쿠폰 발급을 지원하지 않습니다.',
data: {
countryCode: 'XX',
supportedCountries: ['KR', 'US', 'JP']
},
retryable: false
}

status 500

{
status: 'ERROR',
code : 'INTERNAL_SERVER_ERROR'
message: '쿠폰 발급 중 오류가 발생했습니다. ',
retryable: true
retryAfter: 5000
}

status 504

{
status: 'ERROR',
code : 'NETWORK_TIMEOUT'
message: '네트워크 연결 오류입니다. 잠시 후 다시 시도해주세요',
retryable: true
retryAfter: 5000
}
