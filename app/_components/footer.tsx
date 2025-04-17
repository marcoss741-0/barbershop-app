import { Card, CardContent } from "./ui/card";

const Footer = () => {
  return (
    <>
      <footer>
        <Card className="rounded-none">
          <CardContent>
            <p>
              {" "}
              &copy; 2025 Copyright.{" "}
              <span className="font-semibold">Ômega Barbers.</span>
            </p>
          </CardContent>
        </Card>
      </footer>
    </>
  );
};

export default Footer;
