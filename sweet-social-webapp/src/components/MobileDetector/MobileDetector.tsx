import { FunctionComponent, useEffect, useState } from "react";
import "./MobileDetector.scss"
import { Typography } from "antd";
import { MobileOutlined } from '@ant-design/icons'

interface MobileDetectorProps {
    children: any
}

const MobileDetector: FunctionComponent<MobileDetectorProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false)

    const check = () => {
        const windowW = window.innerWidth
        if (windowW <= 567) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    useEffect(() => {
        check()

        window.addEventListener('resize', () => {
            check()
        });
    }, [])

    return (
        !isMobile
            ? children
            : (<div className="mobile-detector">
                <div className="mobile-notification">
                    <MobileOutlined style={{ fontSize: 56 }} />
                    <Typography.Title level={4}>
                        Mobile Device Detected
                    </Typography.Title>
                    <p>Please use a tablet, laptop, or PC to access this web application for optimal performance.</p>
                </div>
            </div>
            )
    );
}

export default MobileDetector;