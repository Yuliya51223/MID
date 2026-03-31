import pkg from "ydb-sdk";

const { Driver, MetadataAuthService, TypedValues } = pkg;

const endpoint = "grpcs://ydb.serverless.yandexcloud.net:2135";
const database = "/ru-central1/b1gg25flf8mn48thb2bu/etndv3jh713l369jtgj4";

let driver;

async function getDriver() {
  if (!driver) {
    driver = new Driver({
      endpoint,
      database,
      authService: new MetadataAuthService(database),
    });

    await driver.ready(10000);
  }

  return driver;
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

    const driver = await getDriver();

    if (method === "GET") {
      const result = await driver.tableClient.withSession(async (session) => {
        return session.executeQuery(`
          SELECT data
          FROM app_state
          WHERE id = "months";
        `);
      });

      const rows = result.resultSets?.[0]?.rows || [];
      const data = rows.length ? rows[0].items?.[0]?.textValue || "[]" : "[]";

      return {
        statusCode: 200,
        headers: headers(),
        body: JSON.stringify({ months: JSON.parse(data) }),
      };
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const months = JSON.stringify(body.months || []);

      await driver.tableClient.withSession(async (session) => {
        return session.executeQuery(
          `
          DECLARE $data AS Utf8;

          UPSERT INTO app_state (id, data)
          VALUES ("months", $data);
          `,
          {
            $data: TypedValues.utf8(months),
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