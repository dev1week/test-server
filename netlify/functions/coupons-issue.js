"use strict";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const RESPONSE_DELAY_MS = 2000;

const successResponse = {  
  status: "SUCCESS",
  code: "COUPON_ISSUED",
  message: "님, 쿠폰이 발급되었습니다.<br>삼성닷컴 쿠폰존에서 확인해보세요.",
  timestamp: new Date().toISOString()
};

const failureResponses = [
  {
    statusCode: 409,
    body: {
      status: "FAIL",
      code: "COUPON_ALREADY_ISSUED",
      message: "님, 이미 쿠폰을 받았어요.<br>삼성닷컴 쿠폰존을 확인해주세요.",
timestamp: new Date().toISOString(),
      retryable: false,
    },
  },
  {
    statusCode: 403,
    body: {
      status: "FAIL",
      code: "NO_SAMSUNG_ACCOUNT",
      message: "님의 삼성계정을 확인할 수 없습니다. <br>삼성닷컴 로그인 후 쿠폰을 받아주세요.",
timestamp: new Date().toISOString(),
      retryable: false,
    },
  },
  {
    statusCode: 410,
    body: {
      status: "FAIL",
      code: "COUPON_PERIOD_EXPIRED",
      message: "님,<br>아쉽지만 쿠폰 발급기간이 끝났어요.",
timestamp: new Date().toISOString(),
      retryable: false,
    },
  },
  {
    statusCode: 400,
    body: {
      status: "FAIL",
      code: "UNSURPPORTED_COUNTRY",
      message: "한국에서만 받을 수 있는 쿠폰입니다.",
      data: {
        countryCode: "KR",
        supportedCountries: ["KR"],
      },
timestamp: new Date().toISOString(),
      retryable: false,
    },
  },
  {
    statusCode: 500,
    body: {
      status: "FAIL",
      code: "INTERNAL_SERVER_ERROR",
      message: "일시적인 오류가 발생했습니다.<br> 잠시 후 다시 시도해주세요",
timestamp: new Date().toISOString(),
      retryable: true,
      retryAfter: 5000,
    },
  },
  
];

function pickOutcome() {
  // 50% success, remaining 50% evenly split across six failure cases.
  if (Math.random() < 0.5) {
    return {
      statusCode: 200,
      body: { ...successResponse, timestamp: new Date().toISOString() },
    };
  }

  const index = Math.floor(Math.random() * failureResponses.length);
  return failureResponses[index];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  await sleep(RESPONSE_DELAY_MS);
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
