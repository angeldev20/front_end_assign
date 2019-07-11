import React, {
  Component
} from 'react';
import {
  Container, Card, CardBody, FormGroup, Input,
  Row, Col
} from 'reactstrap';
import Switch from 'react-switch';

import Api from '../../apis/app';
import OrderCard from '../../scenes/Home/OrderCard';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      workerLoaded: false,
      filterByName: '',
      orderByDate: false
    }
    this.workerRequestExecuted = 0;
    this.workerIds = [];
    this.handleSwitchOrderByDate = this.handleSwitchOrderByDate.bind(this);
    this.handleChangeFilterByName = this.handleChangeFilterByName.bind(this);
    this.loadWorkerSuccess = this.loadWorkerSuccess.bind(this);
    this.loadWorkerFail = this.loadWorkerFail.bind(this);
  }

  async componentWillMount() {
    const {
      body, response
    } = await Api.get('work_orders');
    switch (response.status) {
      case 200:
        await this.setState({
          orders: body.orders,
          loading: false
        });
        this.loadWorkers();
        break;
      default:
        break;
    }
  }

  get filterOrders() {
    const {
      orders, filterByName, orderByDate
    } = this.state;
    const ret = [...orders];
    
    ret.sort((a, b) => (
      orderByDate ? -(a.deadline - b.deadline) : (a.deadline - b.deadline)
    ));

    if (filterByName) {
      return ret.filter((value) => (
        value.worker && value.worker.name.indexOf(filterByName) !== -1
      ));
    }
    return ret;
  }

  loadWorkers() {
    const {
      orders
    } = this.state;

    this.workerIds = [];
    this.workerRequestExecuted = 0;
    for (let i = 0, ni = orders.length; i < ni; i++) {
      const { workerId } = orders[i];
      if (this.workerIds.indexOf(workerId) === -1) {
        this.workerIds.push(workerId);
      }
    }

    for (let i = 0, ni = this.workerIds.length; i < ni; i++) {
      const workerId = this.workerIds[i];
      Api.get(`workers/${workerId}`).then(this.loadWorkerSuccess).catch(this.loadWorkerFail);
    }
  }

  loadWorkerSuccess({ response, body }) {
    const {
      orders
    } = this.state;
    this.workerRequestExecuted++;

    if (response.status === 200) {
      const worker = body.worker;
      for (let i = 0, ni = orders.length; i < ni; i++) {
        const order = orders[i];
        if (worker.id === order.workerId) {
          order.worker = worker;
        }
      }
    }

    if (this.workerRequestExecuted === this.workerIds.length) {
      this.setState({
        orders,
        workerLoaded: true
      })
    }
  }

  loadWorkerFail(e) {
    this.workerRequestExecuted++;
    if (this.workerRequestExecuted === this.workerIds.length) {
      this.setState({
        workerLoaded: true
      })
    }
  }

  handleSwitchOrderByDate(value) {
    this.setState({
      orderByDate: value
    });
  }

  handleChangeFilterByName(event) {
    this.setState({
      filterByName: event.target.value
    });
  }

  render() {
    const {
      workerLoaded
    } = this.state;
    
    const {
      filterOrders
    } = this;
    
    return (
      <Container>
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Input placeholder="Filter by worker name..." name="filterByName" onChange={this.handleChangeFilterByName} />
            </FormGroup>
            <FormGroup className="mb-0">
              <div className="d-flex justify-content-center">
                <div className="mx-4">Earliest first</div>
                <div>
                  <Switch onChange={this.handleSwitchOrderByDate} checked={this.state.orderByDate} />
                </div>
                <div className="mx-4">Latest first</div>
              </div>
            </FormGroup>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Row>
              {
                filterOrders.map((item, index) => (
                  <Col xs={12} md={6} className="mb-3" key={`${index}`}>
                    <OrderCard data={item} done={workerLoaded} />
                  </Col>
                ))
              }
            </Row>
          </CardBody>
        </Card>
      </Container>
    );
  }
};

export default Main;
