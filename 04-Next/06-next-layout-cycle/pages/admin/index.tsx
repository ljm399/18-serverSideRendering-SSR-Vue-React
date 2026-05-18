import type { ReactElement } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import DashboardLayout from "../../components/DashboardLayout";
import type { NextPageWithLayout } from "../_app";

const AdminHome: NextPageWithLayout = () => {
  return (
    <div>
      <h1>admin home</h1>
      <p>
        <Link href="/">Back</Link>
      </p>
    </div>
  );
};

AdminHome.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};

export default AdminHome;
