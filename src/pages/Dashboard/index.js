import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  FormGroup,
  Media,
} from "reactstrap";
import { readCountReportByStatus } from "../../store/pages/report/actions";
import { readArea } from "../../store/pages/area/actions";
import { readRegional } from "../../store/pages/regional/actions";
import { readGrapari } from "../../store/pages/grapari/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router";
import { getShortDate } from "../../helpers/index";
import { AvForm } from "availity-reactstrap-validation";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";

const Dashboard = (props) => {
  const list_count_report_by_status = props.list_count_report_by_status;
  const option_area = props.option_area;
  const option_regional = props.option_regional;
  const option_grapari = props.option_grapari;
  const loading = props.loading;
  const area_code = JSON.parse(localStorage.getItem("areaCode"));
  const regional = JSON.parse(localStorage.getItem("regional"));
  const grapari_id = JSON.parse(localStorage.getItem("grapariId"));
  const username = localStorage.getItem("username");
  const history = useHistory();

  const [chartDate, setChartDate] = useState(null);
  const [chartSeries, setChartSeries] = useState(null);
  const [maxCount, setMaxCount] = useState(null);
  const [totalStatus, setTotalStatus] = useState(null);
  const [data, setData] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState(null);
  const [requestRegional, setRequestRegional] = useState(null);
  const [selectedGrapari, setSelectedGrapari] = useState(null);
  const [requestGrapari, setRequestGrapari] = useState(null);

  const start_date = getShortDate(
    new Date().setDate(new Date().getDate() - 360)
  );
  const end_date = getShortDate(new Date());

  const handleArea = async (event) => {
    let area_code = [];
    await event.map((item) => area_code.push(item.value));

    setSelectedArea(event);
    setSelectedRegional(null);
    setSelectedGrapari(null);
    setData({ ...data, areaCode: area_code, regional: [], grapariId: [] });

    props.readRegional({
      ...requestRegional,
      areaCode: area_code,
    });
    props.readGrapari({
      ...requestGrapari,
      areaCode: area_code,
    });
    props.readCountReportByStatus({
      ...data,
      areaCode: area_code,
      regional: [],
      grapariId: [],
    });
    delete data.areaCode;
    delete data.regional;
    delete data.grapariId;
  };
  const handleRegional = async (event) => {
    let regional = [];
    await event.map((item) => regional.push(item.value));

    setSelectedRegional(event);
    setSelectedGrapari(null);
    setData({ ...data, regional: regional, grapariId: [] });

    props.readGrapari({
      ...requestGrapari,
      regional: regional,
    });
    props.readCountReportByStatus({
      ...data,
      regional: regional,
      grapariId: [],
    });
    delete data.regional;
    delete data.grapariId;
  };
  const handleGrapari = async (event) => {
    let grapari_id = [];
    await event.map((item) => grapari_id.push(item.value));

    setSelectedGrapari(event);
    setData({ ...data, grapariId: grapari_id });

    props.readCountReportByStatus({
      ...data,
      grapariId: grapari_id,
    });
    delete data.grapariId;
  };

  useEffect(() => {
    let reqArea = {
      areaCode: area_code && area_code[0] !== "0" ? area_code : [],
      areaName: "",
      status: "A",
    };
    props.readArea(reqArea);

    let reqRegional = {
      areaCode: area_code && area_code[0] !== "0" ? area_code : [],
      regional: regional && regional[0] !== "0" ? regional : [],
      status: "A",
    };
    props.readRegional(reqRegional);
    setRequestRegional(reqRegional);

    let reqGrapari = {
      areaCode: area_code && area_code[0] !== "0" ? area_code : [],
      regional: regional && regional[0] !== "0" ? regional : [],
      grapariId: grapari_id && grapari_id[0] !== "0" ? grapari_id : [],
      status: "Active",
    };
    props.readGrapari(reqGrapari);
    setRequestGrapari(reqGrapari);

    let item = {
      areaCode: area_code && area_code[0] !== "0" ? area_code : [],
      regional: regional && regional[0] !== "0" ? regional : [],
      grapariId: grapari_id && grapari_id[0] !== "0" ? grapari_id : [],
      startDate: start_date,
      endDate: end_date,
    };
    props.readCountReportByStatus(item);

    setData(item);
  }, []);

  useEffect(() => {
    if (list_count_report_by_status !== null) {
      const date = [];
      const new_status = [];
      const process_status = [];
      const finish_status = [];

      list_count_report_by_status.map((value) => {
        date.push(getShortDate(value.date));
        new_status.push(value.new);
        process_status.push(value.process);
        finish_status.push(value.finish);
      });
      const series = [
        {
          name: "New",
          data: new_status,
        },
        {
          name: "Process",
          data: process_status,
        },
        {
          name: "Finish",
          data: finish_status,
        },
      ];
      const merged_array = [...new_status, ...process_status, ...finish_status];
      setMaxCount(Math.max(...merged_array));
      setTotalStatus([
        {
          name: "New",
          total: new_status.reduce((a, b) => a + b, 0),
          icon: "bx-error-circle",
          bg_color: "#f46a6a",
        },
        {
          name: "Process",
          total: process_status.reduce((a, b) => a + b, 0),
          icon: "bxs-hourglass",
          bg_color: "#556ee6",
        },
        {
          name: "Finish",
          total: finish_status.reduce((a, b) => a + b, 0),
          icon: "bx-check-circle",
          bg_color: "#34c38f",
        },
      ]);
      setChartSeries(series);
      setChartDate(date);
    } else {
      let item = {
        areaCode: area_code && area_code[0] !== "0" ? area_code : [],
        regional: regional && regional[0] !== "0" ? regional : [],
        grapariId: grapari_id && grapari_id[0] !== "0" ? grapari_id : [],
        startDate: start_date,
        endDate: end_date,
      };
      props.readCountReportByStatus(item);
    }
  }, [list_count_report_by_status]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Dashboard"} breadcrumbItem={"Dashboard"} />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col md={3}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: 500 }}
                        >
                          Start Date
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          id="example-date-input"
                          min={getShortDate(
                            new Date().setFullYear(new Date().getFullYear() - 1)
                          )}
                          max={data && data.endDate}
                          defaultValue={data && data.startDate}
                          onChange={(event) => (
                            setData({
                              ...data,
                              startDate: event.target.value,
                            }),
                            props.readCountReportByStatus({
                              ...data,
                              startDate: event.target.value,
                            })
                          )}
                        />
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: 500 }}
                        >
                          End Date
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          id="example-date-input"
                          min={data && data.startDate}
                          max={data && data.endDate}
                          defaultValue={data && data.endDate}
                          onChange={(event) => (
                            setData({
                              ...data,
                              endDate: event.target.value,
                            }),
                            props.readCountReportByStatus({
                              ...data,
                              endDate: event.target.value,
                            })
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <AvForm>
                        {area_code && (
                          <FormGroup className="select2-container">
                            <Label>Area</Label>
                            <Select
                              value={selectedArea}
                              placeholder="All"
                              onChange={(event) => {
                                handleArea(event);
                              }}
                              options={option_area}
                              classNamePrefix="select2-selection"
                              isMulti={true}
                            />
                          </FormGroup>
                        )}
                      </AvForm>
                    </Col>
                    <Col md={3}>
                      <AvForm>
                        {regional && (
                          <FormGroup className="select2-container">
                            <Label>Regional</Label>
                            <Select
                              value={selectedRegional}
                              placeholder="All"
                              onChange={(event) => {
                                handleRegional(event);
                              }}
                              options={option_regional}
                              classNamePrefix="select2-selection"
                              isMulti={true}
                            />
                          </FormGroup>
                        )}
                      </AvForm>
                    </Col>
                    <Col md={3}>
                      <AvForm>
                        {grapari_id && (
                          <FormGroup className="select2-container">
                            <Label>Grapari</Label>
                            <Select
                              value={selectedGrapari}
                              placeholder="All"
                              onChange={(event) => {
                                handleGrapari(event);
                              }}
                              options={option_grapari}
                              classNamePrefix="select2-selection"
                              isMulti={true}
                            />
                          </FormGroup>
                        )}
                      </AvForm>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              {/* <Row className="mt-3">
                <Col className="d-flex justify-content-end">
                  <h3>
                    {data && data.startDate} / {data && data.endDate}
                  </h3>
                </Col>
              </Row> */}
              <Row>
                {totalStatus &&
                  totalStatus.map((value, key) => (
                    <Col md="4" key={"_col_" + key}>
                      <Card className="mini-stats-wid">
                        <CardBody>
                          <Media>
                            <Media body>
                              <h4 className="text-muted font-weight-medium">
                                {value.name}
                              </h4>
                              <h3 className="mb-0">{value.total}</h3>
                            </Media>
                            <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
                              <span
                                className="avatar-title"
                                style={{ backgroundColor: value.bg_color }}
                              >
                                <i
                                  className={
                                    "bx " + value.icon + " font-size-24"
                                  }
                                ></i>
                              </span>
                            </div>
                          </Media>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
              </Row>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      {chartDate && chartSeries && (
                        <ReactApexChart
                          options={{
                            chart: {
                              zoom: { enabled: !1 },
                              toolbar: { show: !1 },
                            },
                            title: {
                              text: `${data.startDate} / ${data.endDate}`,
                              align: "left",
                              style: {
                                fontSize: "18px",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: "500",
                                color: "#495057",
                              },
                            },
                            colors: ["#f46a6a", "#556ee6", "#34c38f"],
                            dataLabels: { enabled: !0 },
                            stroke: { width: [3, 3, 3], curve: "straight" },
                            grid: {
                              row: {
                                colors: [
                                  "transparent",
                                  "transparent",
                                  "transparent",
                                ],
                                opacity: 0.2,
                              },
                              borderColor: "#f1f1f1",
                            },
                            markers: { style: "inverted", size: 6 },
                            xaxis: {
                              categories: chartDate,
                              title: { text: "Date" },
                            },
                            yaxis: {
                              title: { text: "Total Ticket Status" },
                              min: 0,
                              max: maxCount,
                            },
                            legend: {
                              position: "top",
                              horizontalAlign: "right",
                              floating: !0,
                              offsetY: -25,
                              offsetX: -5,
                            },
                            responsive: [
                              {
                                breakpoint: 600,
                                options: {
                                  chart: { toolbar: { show: !1 } },
                                  legend: { show: !1 },
                                },
                              },
                            ],
                          }}
                          series={chartSeries}
                          type="line"
                          height="380"
                        />
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const {
    list_count_report_by_status,
    message_report,
    response_code_report,
    loading,
  } = state.Report;
  const { option_area } = state.Area;
  const { option_regional } = state.Regional;
  const { option_grapari } = state.Grapari;
  return {
    list_count_report_by_status,
    option_area,
    option_regional,
    option_grapari,
    response_code_report,
    message_report,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readCountReportByStatus,
      readArea,
      readRegional,
      readGrapari,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Dashboard);
