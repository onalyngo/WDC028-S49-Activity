import { useRouter } from 'next/router';
// Bootstrap components
import { Row, Col, Jumbotron } from 'react-bootstrap';
// Import nextJS Link component for client-side navigation
import BackButton from './BackButton';
import TravelButton from './TravelButton';

export default function Banner({data}) {

    const router = useRouter()
    // Destructure the data prop by its properties
    const {title, content} = data

    return (
        <Row>
            <Col>
                <Jumbotron>
                    <h1>{title}</h1>
                    <p>{content}</p>
                    { router.pathname === '/' 
                        ? 
                            <TravelButton /> 
                        : 
                            <BackButton />
                    }
                </Jumbotron>
            </Col>
        </Row>
    )
}