import AccessDenied from "../../components/access/AccessDenied";

export default function RestrictedContentPage() {
  return (
    <AccessDenied
      title="Restricted Content"
      message="Access is granted only through approved custodians."
    />
  );
}
