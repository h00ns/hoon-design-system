import { Link } from '@hoon-ds/react';

export default function VariantsExample() {
  return (
    <>
      <Link href="#default">default</Link>
      <Link href="#subtle" variant="subtle">
        subtle
      </Link>
      <Link href="#hover" underline="hover">
        underline="hover"
      </Link>
    </>
  );
}
