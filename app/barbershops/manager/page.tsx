import Header from "../../_components/header";
import { queryUser } from "../../_data/query-on-db";

interface ManageBarbershopsProps {
  params: {
    email?: string;
  };
}

const ManageBarbershops = async ({ params }: ManageBarbershopsProps) => {
  const user = await queryUser(params.email);
  return (
    <>
      <Header />
      <div className="p-4">
        <h1>{user.name}</h1>
      </div>
    </>
  );
};

export default ManageBarbershops;
