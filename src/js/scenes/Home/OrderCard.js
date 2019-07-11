/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import {
  Card, CardBody, Alert
} from 'reactstrap';
import { Facebook } from 'react-content-loader';
import moment from 'moment';

const OrderCard = (props) => {
  const {
    data, done
  } = props;

  const {
    worker
  } = data;

  return (
    <Card className="card-work-orders">
      <CardBody>
        <h4>{data.name}</h4>
        <div className="mb-3">
          {data.description}
        </div>
        {
          worker ? (
            <div className="worker">
              <div className="photo">
                <img src={worker.image} alt={worker.name} className="img-thumbnail" />
              </div>
              <div className="detail">
                <h5>{worker.name}</h5>
                <div>{worker.companyName}</div>
                <div>{worker.email}</div>
              </div>
            </div>
          ) : (
            done ? (
              <Alert color="warning">
                Couldn’t find worker
              </Alert>
            ) : (
              <Facebook />
            )
          )
        }
        <div className="text-right">
          <i>{moment(new Date(data.deadline * 1000)).format('MM/DD/YYYY, h:m:s A')}</i>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderCard;
