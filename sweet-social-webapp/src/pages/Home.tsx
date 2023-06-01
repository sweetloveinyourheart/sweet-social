import { Col, Row, Typography } from "antd";
import SuggestedAccount from "../features/User/components/SuggestedAccount";
import Newsfeed from "../features/Post/components/Newsfeed/Newsfeed";

function Home() {
    return (
        <div className="main-area">
            <Row gutter={16}>
                <Col span={16}>
                    <Newsfeed />
                </Col>
                <Col span={8}>
                    <SuggestedAccount />
                    <Typography.Text style={{ color: "#777", fontSize: 13 }}>
                        © 2023 SWEETBOOK FROM TYNX
                    </Typography.Text>
                </Col>
            </Row>
        </div>
    );
}

export default Home;