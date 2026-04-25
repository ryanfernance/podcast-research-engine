export default async (req) => {
  const { topic, metric } = await req.json();
  const API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE = "appB2j3PDVx9tsBpH";
  const TABLE = "tbl8rKLT5QaP802H2";
  
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "AIRTABLE_API_KEY not set" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Fetch studios from Airtable - active MDS/MDS Pro clients
    const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?filterByFormula=AND(OR({Program}='MDS',{Program}='MDS Pro'),{Status}='Active')&maxRecords=200`;
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });
    const data = await res.json();
    
    if (!data.records) {
      return new Response(JSON.stringify({ error: "No records found", raw: data }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Score each studio as a potential podcast guest
    const studios = data.records
      .filter(r => r.fields && r.fields["Studio Name"] && r.id !== "recfXSJfUsLMQawy4") // Exclude test record
      .map(r => {
        const f = r.fields;
        return {
          id: r.id,
          name: f["Studio Name"] || "",
          owner: f["Owner Name"] || f["Primary Contact"] || "",
          program: f["Program"] || "",
          type: f["Studio Type"] || f["Business Type"] || "",
          location: f["Location"] || f["State"] || "",
          revenue: parseFloat(f["Monthly Revenue"] || f["Revenue"] || 0),
          members: parseInt(f["Active Members"] || f["Members"] || 0),
          kickoff: f["Kick-off Date"] || f["Kickoff Date"] || "",
        };
      });

    // Sort by revenue descending as default, or by metric if specified
    if (metric === "members") {
      studios.sort((a, b) => b.members - a.members);
    } else {
      studios.sort((a, b) => b.revenue - a.revenue);
    }

    // Return top 20
    return new Response(JSON.stringify({ studios: studios.slice(0, 20) }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  timeout: 15
};
