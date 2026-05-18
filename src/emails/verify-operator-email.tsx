// src/emails/verify-operator-email.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface Props {
  name: string;
  workshopName: string;
  verifyUrl: string;
}

export function VerifyOperatorEmail({ name, workshopName, verifyUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Verifikasi email akun BengkelKu untuk {workshopName}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-10 px-4 max-w-lg">
            {/* Header */}
            <Section className="bg-blue-600 rounded-t-2xl px-8 py-6 text-center">
              <Heading className="text-white text-2xl font-bold m-0">
                🔧 BengkelKu
              </Heading>
              <Text className="text-blue-100 text-sm mt-1 mb-0">
                Platform Manajemen Bengkel
              </Text>
            </Section>

            {/* Body */}
            <Section className="bg-white px-8 py-8 rounded-b-2xl shadow-sm">
              <Heading className="text-gray-900 text-xl font-bold">
                Verifikasi Email Kamu
              </Heading>

              <Text className="text-gray-600 text-sm leading-relaxed">
                Halo <strong>{name}</strong>,
              </Text>

              <Text className="text-gray-600 text-sm leading-relaxed">
                Terima kasih sudah mendaftarkan <strong>{workshopName}</strong>{" "}
                di BengkelKu. Klik tombol di bawah untuk memverifikasi email
                kamu dan mulai menggunakan platform.
              </Text>

              <Section className="text-center my-8">
                <Button
                  href={verifyUrl}
                  className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl text-sm no-underline inline-block">
                  Verifikasi Email Sekarang
                </Button>
              </Section>

              <Text className="text-gray-500 text-xs leading-relaxed">
                Link verifikasi ini berlaku selama <strong>24 jam</strong>. Jika
                kamu tidak mendaftar di BengkelKu, abaikan email ini.
              </Text>

              <Hr className="border-gray-200 my-6" />

              <Text className="text-gray-400 text-xs">
                Atau copy link ini ke browser kamu:
              </Text>
              <Text className="text-blue-600 text-xs break-all">
                {verifyUrl}
              </Text>
            </Section>

            {/* Footer */}
            <Text className="text-center text-gray-400 text-xs mt-6">
              © {new Date().getFullYear()} BengkelKu · Platform Bengkel
              Kendaraan Indonesia
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default VerifyOperatorEmail;
