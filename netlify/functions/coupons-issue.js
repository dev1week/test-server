"use strict";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const successResponse = {
  status: "SUCCESS",
  code: "COUPON_ISSUED",
  message: "계정 쿠폰이 정상적으로 발급되었습니다.",
  data: {
    email: "yuxin.kim@samsung.com",
    couponId: "CP-2026031700001",
    couponCode: "SAVE20MARS26",
    expiryDate: "2026-04-30",
  },
  timestamp: new Date().toISOString(),
};

const failureResponses = [
  {
    statusCode: 409,
    body: {
      status: "FAILED",
      code: "COUPON_ALREADY_ISSUED",
      message: "계정에게 이미 발급된 쿠폰이 있습니다.",
      data: {
        email: "yuxin.kim@samsung.com",
        existingCouponId: "CP-2026031700001",
        expiryDate: "2026-04-30",
      },
      retryable: false,
    },
  },
  {
    statusCode: 403,
    body: {
      status: "FAILED",
      code: "NO_SAMSUNG_ACCOUNT",
      message: "삼성 계정이 등록되지 않은 사용자입니다.",
      data: {
        email: "yuxin.kim@samsung.com",
        guid: "550e8400-e92b-41d-a716-446655440000",
      },
      retryable: false,
    },
  },
  {
    statusCode: 410,
    body: {
      status: "FAILED",
      code: "COUPON_PERIOD_EXPIRED",
      message: "쿠폰 발급 기간이 만료되었습니다.",
      retryable: false,
    },
  },
  {
    statusCode: 400,
    body: {
      status: "FAILED",
      code: "UNSURPPORTED_COUNTRY",
      message: "해당 국가에서는 쿠폰 발급을 지원하지 않습니다.",
      data: {
        countryCode: "XX",
        supportedCountries: ["KR", "US", "JP"],
      },
      retryable: false,
    },
  },
  {
    statusCode: 500,
    body: {
      status: "ERROR",
      code: "INTERNAL_SERVER_ERROR",
      message: "쿠폰 발급 중 오류가 발생했습니다.",
      retryable: true,
      retryAfter: 5000,
    },
  },
  {
    statusCode: 504,
    body: {
      status: "ERROR",
      code: "NETWORK_TIMEOUT",
      message: "네트워크 연결 오류입니다. 잠시 후 다시 시도해주세요",
      retryable: true,
      retryAfter: 5000,
    },
  },
];

function pickOutcome() {
  // 50% success, remaining 50% evenly split across six failure cases.
  if (Math.random() < 0.5) {
    return { statusCode: 200, body: { ...successResponse, timestamp: new Date().toISOString() } };
  }

  const index = Math.floor(Math.random() * failureResponses.length);
  return failureResponses[index];
}

exports.handler = async (event) => {
  const method = event.httpMethod || "";

  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (method !== "GET" && method !== "POST") {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        status: "FAILED",
        code: "METHOD_NOT_ALLOWED",
        message: "GET 또는 POST 요청만 지원합니다.",
      }),
    };
  }

  const outcome = pickOutcome();

  return {
    statusCode: outcome.statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(outcome.body),
  };
};
