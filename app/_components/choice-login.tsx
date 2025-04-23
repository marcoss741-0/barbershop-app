import Image from "next/image";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ChoiceLoginProps {
  action: () => void;
  isPending: boolean;
}

const ChoiceLogin = ({ action, isPending }: ChoiceLoginProps) => {
  return (
    <>
      <Tabs defaultValue="client" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Cliente</TabsTrigger>
          <TabsTrigger value="owner">Propriétario</TabsTrigger>
        </TabsList>
        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>Entre-Já</CardTitle>
              <CardDescription>
                Se você procura pelo melhores da cidade, faça login com o
                Google.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={action}
                >
                  <span className="flex items-center justify-center gap-2 text-sm">
                    {!isPending ? (
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                      />
                    ) : (
                      <Image
                        alt="isLoading"
                        width={20}
                        height={20}
                        src="/loading.svg"
                      />
                    )}
                    Login com o Google
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="owner">
          <Card>
            <CardHeader>
              <CardTitle>Faça parte</CardTitle>
              <CardDescription>
                Se você possui uma barbearia e quer aumentar
                sua clientela faça parte da nossa equipe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex w-full items-center justify-between gap-3">
                <Button className="w-full" variant="secondary">
                  Entrar
                </Button>
                <Button className="w-full" variant="outline">
                  Cadastrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ChoiceLogin;
