import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";


export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

        
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>
                  ${data?.stats?.totalIncome.toFixed(2)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>
                  ${data?.stats?.totalExpenses.toFixed(2)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  ${(
                    data?.stats?.totalIncome - data?.stats?.totalExpenses
                  ).toFixed(2)}
                </Text>
              </div>
            </Section>

        
            {data?.stats?.byCategory && (
  <Section style={styles.section}>
    <Heading style={styles.heading}>Expenses by Category</Heading>
    {Object.entries(data?.stats?.byCategory).map(
      ([category, amount]) => (
        <div key={category} style={styles.row}>
          <Text style={styles.text}>{category}: </Text> {/* Added colon and space */}
          <Text style={styles.text}>${amount.toFixed(2)}</Text>
        </div>
      )
    )}
  </Section>

            )}

           
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>FinanceSecure AI Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using FinanceSecure. Keep tracking your finances for better
              financial wealth!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>
                  ${data?.budgetAmount.toFixed(2)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>
                  ${data?.totalExpenses.toFixed(2)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  ${(
                    data?.budgetAmount - data?.totalExpenses
                  ).toFixed(2)}
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#f4f7fa",
    fontFamily: "'Arial', sans-serif",
    color: "#2d3748",
    padding: "20px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    fontSize: "16px",
  },
  title: {
    color: "#1a202c",
    fontSize: "36px",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 25px",
  },
  heading: {
    color: "#1a202c",
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 12px",
  },
  text: {
    color: "#4a5568",
    fontSize: "16px",
    margin: "0 0 16px",
    lineHeight: "1.5",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f7fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  statsContainer: {
    margin: "20px 0",
    padding: "20px",
    backgroundColor: "#f7fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  stat: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  footer: {
    color: "#718096",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "15px",
    borderTop: "1px solid #e2e8f0",
    lineHeight: "1.6",
  },
};
