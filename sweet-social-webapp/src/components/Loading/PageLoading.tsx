import { Layout, Spin } from "antd";
import { FunctionComponent } from "react";

interface PageLoadingProps {

}

const PageLoading: FunctionComponent<PageLoadingProps> = () => {
    return (
        <Layout style={{ display: 'flex', placeContent: 'center', height: '100vh' }}>
            <Spin />
        </Layout>
    );
}

export default PageLoading;