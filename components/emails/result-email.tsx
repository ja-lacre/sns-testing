import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Heading,
  Hr,
} from '@react-email/components';

interface ResultEmailProps {
  studentName: string;
  examName: string;
  className: string;
  score: number;
  totalScore: number;
}

export const ResultEmail = ({
  studentName,
  examName,
  className,
  score,
  totalScore,
}: ResultEmailProps) => {
  const percentage = Math.round((score / totalScore) * 100);
  
  // Determine color based on score
  const isPassing = percentage >= 50;
  const scoreColor = isPassing ? '#146939' : '#b91c1c';

  return (
    <Html>
      <Preview>Exam Results Available: {examName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Exam Results Notification</Heading>
          <Text style={text}>Hello <strong>{studentName}</strong>,</Text>
          <Text style={text}>
            Your results for the <strong>{examName}</strong> in <strong>{className}</strong> have been released.
          </Text>

          <Section style={scoreSection}>
            <Text style={scoreLabel}>Your Score</Text>
            <Heading style={{ ...scoreText, color: scoreColor }}>
              {score} <span style={totalText}>/ {totalScore}</span>
            </Heading>
            <Text style={percentageText}>({percentage}%)</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

// Simple inline styles for email compatibility
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#17321A',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.1',
  margin: '0 0 24px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
};

const scoreSection = {
  padding: '24px',
  border: '1px solid #e6e6e6',
  borderRadius: '12px',
  textAlign: 'center' as const,
  margin: '32px 0',
  backgroundColor: '#f9fafb',
};

const scoreLabel = {
  color: '#8898aa',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  fontWeight: 'bold',
  letterSpacing: '1px',
  marginBottom: '8px',
};

const scoreText = {
  fontSize: '48px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1',
};

const totalText = {
  fontSize: '24px',
  color: '#8898aa',
  fontWeight: '400',
};

const percentageText = {
  color: '#525f7f',
  fontSize: '16px',
  fontWeight: '500',
  marginTop: '8px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

export default ResultEmail;