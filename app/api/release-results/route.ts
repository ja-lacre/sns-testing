import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components'; // Keep this package
import ResultEmail from '@/components/emails/result-email';

export async function POST(request: Request) {
  try {
    const { examId } = await request.json();
    const supabase = await createClient();

    // 1. Fetch Data (Same as before)
    const { data: exam } = await supabase
      .from('exams')
      .select('*, class:classes(name, code)')
      .eq('id', examId)
      .single();

    const { data: results } = await supabase
      .from('results')
      .select('*, student:students(full_name, email)')
      .eq('exam_id', examId)
      .not('score', 'is', null);

    if (!results || results.length === 0) return NextResponse.json({ message: 'No scores' });

    // 2. Setup Gmail Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 3. Send Emails
    const emailPromises = results.map(async (result) => {
      if (!result.student?.email) return null;

      // Convert React Email component to HTML string
      const emailHtml = await render(
        ResultEmail({
          studentName: result.student.full_name,
          examName: exam.name,
          className: `${exam.class.name} (${exam.class.code})`,
          score: result.score,
          totalScore: exam.total_score || 100,
        })
      );

      try {
        await transporter.sendMail({
          from: '"SNS" <' + process.env.GMAIL_USER + '>',
          to: result.student.email, // Now sends to ANY email
          subject: `Exam Results: ${exam.name}`,
          html: emailHtml,
        });
        return true;
      } catch (err) {
        console.error(`Failed to send to ${result.student.email}`, err);
        return null;
      }
    });

    await Promise.all(emailPromises);

    // 4. Update Status
    await supabase
      .from('exams')
      .update({ release_status: 'released', auto_release: false })
      .eq('id', examId);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}