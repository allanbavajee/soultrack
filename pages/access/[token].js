import dynamic from "next/dynamic";

const AccessPage = dynamic(() => import("../../components/AccessPage"), {
  ssr: false,
});

export default function AccessTokenPage() {
  return <AccessPage />;
}
