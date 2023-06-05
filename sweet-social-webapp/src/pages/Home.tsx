import { Col, Row, Typography } from "antd";
import SuggestedAccount from "../features/User/components/SuggestedAccount";
import Newsfeed from "../features/Post/components/Newsfeed/Newsfeed";

function Home() {
    return (
        <div className="main-area">
            <Row gutter={16}>
                <Col sm={24} lg={16}>
                    <Newsfeed />
                </Col>
                <Col sm={24} lg={8}>
                    <SuggestedAccount />
                </Col>
            </Row>
        </div>
    );
}

export default Home;