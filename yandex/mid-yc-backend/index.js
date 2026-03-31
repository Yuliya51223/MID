import pkg from "ydb-sdk";

const { Driver, MetadataAuthService, SessionPool, TypedValues } = pkg;

const endpoint =
  "grpcs://ydb.serverless.yandexcloud.net:2135/?database=/ru-central1/b1gg25flf8mn48thb2bu/etndv3jh713l369jtgj4";

const database =
  "/ru-central1/b1gg25flf8mn48thb2bu/etndv3jh713l369jtgj4";

let driver;
let pool;

async function getPool() {
  if (!driver) {
    driver = new Driver({
      endpoint,
      database,
      authService: new MetadataAuthService(),
    });

    await driver.ready(10000);
    pool = new SessionPool(driver);
  }

  return pool;
}

function headers() {
  return {
    "Content-Type": "application/json",
  };
}

export const handler = async (event) => {
  try {
    const method =
      event.httpMethod ||
      event.requestContext?.http?.method ||
      "GET";

    const pool = await getPool();

    if (method === "GET") {
      const result = await pool.retryOperation(async (session) => {
        return session.executeQuery(`
          SELECT data
          FROM app_state
          WHERE id = "months";
        `);
      });

      const rows = result.resultSets?.[0]?.rows || [];
      const data = rows.length ? rows[0].data : "[]";

      return {
        statusCode: 200,
        headers: headers(),
        body: JSON.stringify({ months: JSON.parse(data) }),
      };
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const months = JSON.stringify(body.months || []);

      await pool.retryOperation(async (session) => {
        return session.executeQuery(
          `
          UPSERT INTO app_state (id, data)
          VALUES ("months", $data);
          `,
          {
            "$data": TypedValues.utf8(months),
          }
        );
      });

      return {
        statusCode: 200,
        headers: headers(),
        body: JSON.stringify({ ok: true }),
      };
    }

    return {
      statusCode: 405,
      headers: headers(),
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers(),
      body: JSON.stringify({ error: String(error) }),
    };
  }
};