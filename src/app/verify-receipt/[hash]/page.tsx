import VerifyReceiptClient from "./VerifyReceiptClient";

type PageProps = {
  params: Promise<{ hash: string }>;
};

export default async function VerifyReceiptPage({ params }: PageProps) {
  const { hash } = await params;

  return <VerifyReceiptClient hash={hash} />;
}
