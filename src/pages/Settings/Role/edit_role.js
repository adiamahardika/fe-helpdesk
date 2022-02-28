import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, CardHeader } from "reactstrap";
import { updateRole } from "../../../store/pages/role/actions";
import { readPermission } from "../../../store/pages/permission/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import code_all_permissions from "../../../helpers/code_all_permissions.json";
import list_all_permission from "../../../helpers/list_all_permission.json";
import general_constant from "../../../helpers/general_constant.json";
import SweetAlert from "react-bootstrap-sweetalert";
import UnsavedChangesWarning from "../../../helpers/unsaved_changes_warning";
import routes from "../../../helpers/routes.json";
import CryptoJS from "crypto-js";
require("dotenv").config();

const EditRole = (props) => {
  const message = props.message_role;
  const response_code = props.response_code_role;
  const option_permission = props.option_permission;
  const editRoleValue = props.location.editRoleValue;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [permissionData, setPermissionData] = useState([]);

  const [isChecked, setIsChecked] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };
  const onSubmitEdit = async () => {
    props.updateRole({
      id: editRoleValue.id,
      name: data.name,
      listPermission: [...permissionData],
    });
    setIsShowSweetAlert(true);
    setPristine();
  };
  const handleIsCheckedMainMenu = async (value, index) => {
    let findPermissionId = [];
    let newArrayIsChecked = null;
    let newArrayPermissionData = [...permissionData];

    if (isChecked) {
      newArrayIsChecked = [...isChecked];

      newArrayIsChecked[index].checked = !isChecked[index].checked;

      // Main Menu
      findPermissionId.push(
        await option_permission.find(
          (option_permission_value) =>
            option_permission_value.code === value.code
        )
      );

      // Sub Level 1
      await value.sub_level_1.map(async (sl1_value, sl1_index) => {
        newArrayIsChecked[index].sub_level_1[sl1_index].checked =
          newArrayIsChecked[index].checked;

        let findSl1 = await option_permission.find(
          (option_permission_value) =>
            option_permission_value.code === sl1_value.code
        );

        findPermissionId.push(findSl1);
      });

      // Sub Level 2
      await value.sub_level_1.map(async (sl1_value, sl1_index) => {
        if (value.sub_level_1[sl1_index].sub_level_2) {
          await sl1_value.sub_level_2.map(async (sl2_value, sl2_index) => {
            newArrayIsChecked[index].sub_level_1[sl1_index].sub_level_2[
              sl2_index
            ].checked = newArrayIsChecked[index].checked;

            let findSl2 = await option_permission.find(
              (option_permission_value) =>
                option_permission_value.code === sl2_value.code
            );
            findPermissionId.push(findSl2);
          });
        }
      });

      setIsChecked(newArrayIsChecked);
    }

    findPermissionId.map((findPermissionIdValue) => {
      let findPermissionIndex = newArrayPermissionData.findIndex(
        (permissionDataValue) =>
          permissionDataValue.id === findPermissionIdValue.value
      );
      if (findPermissionIndex >= 0) {
        newArrayPermissionData.splice(findPermissionIndex, 1);
      } else if (newArrayIsChecked[index].checked !== false) {
        newArrayPermissionData.push({
          id: findPermissionIdValue.value,
        });
      }
    });
    setPermissionData(newArrayPermissionData);
    setDirty();
  };
  const handleIsCheckedSubLevel1 = async (value, index, sl1_index) => {
    let findPermissionId1 = null;
    let findPermissionId2 = [];
    let count = {};
    let newArrayPermissionData = [...permissionData];
    let newArrayIsChecked = null;

    if (isChecked) {
      newArrayIsChecked = [...isChecked];

      // Sub Level 1
      newArrayIsChecked[index].sub_level_1[sl1_index].checked =
        !isChecked[index].sub_level_1[sl1_index].checked;
      findPermissionId2.push(
        await option_permission.find(
          (option_permission_value) =>
            option_permission_value.code === value.sub_level_1[sl1_index].code
        )
      );

      // Sub Level 2
      if (value.sub_level_1[sl1_index].sub_level_2) {
        await value.sub_level_1[sl1_index].sub_level_2.map(
          async (sl2_value, sl2_index) => {
            newArrayIsChecked[index].sub_level_1[sl1_index].sub_level_2[
              sl2_index
            ].checked = newArrayIsChecked[index].sub_level_1[sl1_index].checked;

            findPermissionId2.push(
              await option_permission.find(
                (option_permission_value) =>
                  option_permission_value.code === sl2_value.code
              )
            );
          }
        );
      }

      // Main Menu
      findPermissionId1 = await option_permission.find(
        (option_permission_value) => option_permission_value.code === value.code
      );
      let findPermissionIndex = newArrayPermissionData.findIndex(
        (permissionDataValue) =>
          permissionDataValue.id === findPermissionId1.value
      );
      await newArrayIsChecked[index].sub_level_1.forEach((obj) => {
        let key = JSON.stringify(obj.checked);
        count[key] = (count[key] || 0) + 1;
      });
      if (!count.true && findPermissionIndex >= 0) {
        newArrayIsChecked[index].checked = false;
        newArrayPermissionData.splice(findPermissionIndex, 1);
      } else {
        newArrayIsChecked[index].checked = true;
        if (findPermissionIndex < 0) {
          newArrayPermissionData.push({
            id: findPermissionId1.value,
          });
        }
      }
      setIsChecked(newArrayIsChecked);
    }

    findPermissionId2.map((findPermissionIdValue) => {
      let findPermissionIndex = newArrayPermissionData.findIndex(
        (permissionDataValue) =>
          permissionDataValue.id === findPermissionIdValue.value
      );
      if (findPermissionIndex >= 0) {
        newArrayPermissionData.splice(findPermissionIndex, 1);
      } else if (
        newArrayIsChecked[index].sub_level_1[sl1_index].checked !== false
      ) {
        newArrayPermissionData.push({
          id: findPermissionIdValue.value,
        });
      }
    });
    setPermissionData(newArrayPermissionData);
    setDirty();
  };
  const handleIsCheckedSubLevel2 = async (
    value,
    index,
    sl1_index,
    sl2_index
  ) => {
    let findPermissionId1 = null;
    let findPermissionId2 = null;
    let findPermissionId3 = [];
    let count = {};
    let count_sub_level_1 = {};
    let newArrayPermissionData = [...permissionData];
    if (isChecked) {
      let newArrayIsChecked = [...isChecked];

      // Sub Level 2
      newArrayIsChecked[index].sub_level_1[sl1_index].sub_level_2[
        sl2_index
      ].checked =
        !isChecked[index].sub_level_1[sl1_index].sub_level_2[sl2_index].checked;
      findPermissionId3.push(
        await option_permission.find(
          (option_permission_value) =>
            option_permission_value.code ===
            value.sub_level_1[sl1_index].sub_level_2[sl2_index].code
        )
      );

      // Sub Level 1
      findPermissionId2 = await option_permission.find(
        (option_permission_value) =>
          option_permission_value.code === value.sub_level_1[sl1_index].code
      );
      let findPermissionIndex2 = newArrayPermissionData.findIndex(
        (permissionDataValue) =>
          permissionDataValue.id === findPermissionId2.value
      );
      await newArrayIsChecked[index].sub_level_1[sl1_index].sub_level_2.forEach(
        (obj) => {
          let key = JSON.stringify(obj.checked);
          count_sub_level_1[key] = (count_sub_level_1[key] || 0) + 1;
        }
      );
      if (!count_sub_level_1.true && findPermissionIndex2 >= 0) {
        newArrayIsChecked[index].sub_level_1[sl1_index].checked = false;
        newArrayPermissionData.splice(findPermissionIndex2, 1);
      } else {
        newArrayIsChecked[index].sub_level_1[sl1_index].checked = true;
        if (findPermissionIndex2 < 0) {
          newArrayPermissionData.push({
            id: findPermissionId2.value,
          });
        }
      }

      // Main Menu
      findPermissionId1 = await option_permission.find(
        (option_permission_value) => option_permission_value.code === value.code
      );
      let findPermissionIndex1 = newArrayPermissionData.findIndex(
        (permissionDataValue) =>
          permissionDataValue.id === findPermissionId1.value
      );
      await newArrayIsChecked[index].sub_level_1.forEach((obj) => {
        let key = JSON.stringify(obj.checked);
        count[key] = (count[key] || 0) + 1;
      });
      if (!count.true && findPermissionIndex1 >= 0) {
        newArrayIsChecked[index].checked = false;
        newArrayPermissionData.splice(findPermissionIndex1, 1);
      } else {
        newArrayIsChecked[index].checked = true;
        if (findPermissionIndex1 < 0) {
          newArrayPermissionData.push({
            id: findPermissionId1.value,
          });
        }
      }
      setIsChecked(newArrayIsChecked);
    }

    findPermissionId3.map((findPermissionIdValue) => {
      let findPermissionIndex = newArrayPermissionData.findIndex(
        (permissionDataValue) =>
          permissionDataValue.id === findPermissionIdValue.value
      );
      if (findPermissionIndex >= 0) {
        newArrayPermissionData.splice(findPermissionIndex, 1);
      } else {
        newArrayPermissionData.push({
          id: findPermissionIdValue.value,
        });
      }
    });
    setPermissionData(newArrayPermissionData);
    setDirty();
  };
  console.log(data);
  console.log(permissionData);
  const ButtonSubmitEdit = () => {
    if (
      data &&
      Object.keys(data).length >= 1 &&
      Object.values(data).every((value) => value !== "") &&
      permissionData.length >= 1
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitEdit();
          }}
        >
          <i className="bx bx bx-save font-size-16 align-middle mr-2"></i> Save
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          disabled
          style={{ cursor: "default" }}
        >
          <i className="bx bx bx-save font-size-16 align-middle mr-2"></i> Save
        </button>
      );
    }
  };
  const ShowSweetAlert = () => {
    let value = null;
    if (isShowSweetAlert) {
      if (response_code === general_constant.success_response_code) {
        value = (
          <SweetAlert
            title={general_constant.success_message}
            success
            confirmBtnBsStyle="success"
            onConfirm={() => {
              setIsShowSweetAlert(false);
              setData(null);
              history.push(routes.role);
            }}
          >
            Role has successfully edited!
          </SweetAlert>
        );
      } else {
        value = (
          <SweetAlert
            title={general_constant.error_message}
            error
            confirmBtnBsStyle="success"
            onConfirm={() => {
              setIsShowSweetAlert(false);
            }}
          >
            {message}
          </SweetAlert>
        );
      }
    }
    return value;
  };

  useEffect(() => {
    let newArray = [];
    let isEditRole = permissions.find(
      (value) => value.code === code_all_permissions.edit_role
    );

    if (editRoleValue && isEditRole) {
      props.readPermission();

      list_all_permission.map(
        (value, index) => (
          editRoleValue.listPermission.find((v) => v.code === value.code)
            ? newArray.push({ checked: true, sub_level_1: [] })
            : newArray.push({ checked: false, sub_level_1: [] }),
          value.sub_level_1 &&
            value.sub_level_1.map(
              (sl1_value, sl1_index) => (
                editRoleValue.listPermission.find(
                  (v) => v.code === sl1_value.code
                )
                  ? newArray[index].sub_level_1.push({
                      checked: true,
                      sub_level_2: [],
                    })
                  : newArray[index].sub_level_1.push({
                      checked: false,
                      sub_level_2: [],
                    }),
                sl1_value.sub_level_2 &&
                  sl1_value.sub_level_2.map((sl2_value) => {
                    editRoleValue.listPermission.find(
                      (v) => v.code === sl2_value.code
                    )
                      ? newArray[index].sub_level_1[sl1_index].sub_level_2.push(
                          {
                            checked: true,
                          }
                        )
                      : newArray[index].sub_level_1[sl1_index].sub_level_2.push(
                          {
                            checked: false,
                          }
                        );
                  })
              )
            )
        )
      );
      setIsChecked(newArray);
      setData(editRoleValue);
      setPermissionData(editRoleValue.listPermission);
      setDirty();
    } else {
      history.push(routes.role);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Role"} breadcrumbItem={"Edit Role"} />
          <Card>
            <CardBody>
              <div
                className="col-md-12 mb-3"
                style={{
                  display: "grid",
                  justifyItems: "flex-end",
                  gridTemplateColumns: "1fr",
                  columnGap: "8px",
                }}
              >
                {" "}
                <ButtonSubmitEdit />
              </div>
              <AvForm>
                <AvField
                  name="name"
                  label="Name"
                  placeholder="ex: ADMIN"
                  type="text"
                  errorMessage="Enter Role Name"
                  validate={{ required: { value: true } }}
                  onChange={onChangeData}
                  value={editRoleValue && editRoleValue.name}
                />
              </AvForm>
              <div>
                <label>Permissions</label>
                {list_all_permission.map((value, index) => (
                  <Card outline color="light" className="border" key={index}>
                    <CardHeader className="bg-transparent">
                      <div className="custom-control custom-checkbox mb-3">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="CustomCheck1"
                          onChange={() => false}
                          checked={isChecked && isChecked[index].checked}
                        />
                        <label
                          className="custom-control-label"
                          onClick={() => {
                            handleIsCheckedMainMenu(value, index);
                          }}
                        >
                          <h5 className="my-0">
                            {" "}
                            {value.code} <span>{value.name}</span>
                          </h5>
                        </label>
                      </div>
                    </CardHeader>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `${
                          value.sub_level_1.every((item) => !item.sub_level_2)
                            ? `repeat(4, 1fr)`
                            : `1fr`
                        }`,
                      }}
                    >
                      {value.sub_level_1 &&
                        value.sub_level_1.map((sl1_value, sl1_index) => (
                          <ul
                            className="sub-menu"
                            aria-expanded="true"
                            style={{ listStyle: "none" }}
                          >
                            <li>
                              <div className="has-arrow">
                                <div className="custom-control custom-checkbox mb-3">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="CustomCheck1"
                                    onChange={() => false}
                                    checked={
                                      isChecked &&
                                      isChecked[index].sub_level_1[sl1_index]
                                        .checked
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    onClick={() => {
                                      handleIsCheckedSubLevel1(
                                        value,
                                        index,
                                        sl1_index
                                      );
                                    }}
                                  >
                                    {sl1_value.code}{" "}
                                    <span>{sl1_value.name}</span>
                                  </label>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(4, 1fr)",
                                }}
                              >
                                {sl1_value.sub_level_2 &&
                                  sl1_value.sub_level_2.map(
                                    (sl2_value, sl2_index) => (
                                      <ul
                                        className="sub-menu"
                                        aria-expanded="true"
                                        style={{ listStyle: "none" }}
                                      >
                                        <li>
                                          <div className="custom-control custom-checkbox mb-3">
                                            <input
                                              type="checkbox"
                                              className="custom-control-input"
                                              id="CustomCheck1"
                                              onChange={() => false}
                                              checked={
                                                isChecked &&
                                                isChecked[index].sub_level_1[
                                                  sl1_index
                                                ].sub_level_2[sl2_index].checked
                                              }
                                            />
                                            <label
                                              className="custom-control-label"
                                              onClick={() => {
                                                handleIsCheckedSubLevel2(
                                                  value,
                                                  index,
                                                  sl1_index,
                                                  sl2_index
                                                );
                                              }}
                                            >
                                              {sl2_value.code}{" "}
                                              <span>{sl2_value.name}</span>
                                            </label>
                                          </div>
                                        </li>
                                      </ul>
                                    )
                                  )}
                              </div>
                            </li>
                          </ul>
                        ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
          {Prompt}
          <ShowSweetAlert />
        </Container>
      </div>
    </React.Fragment>
  );
};
const mapStatetoProps = (state) => {
  const { option_permission, list_permission } = state.Permission;
  const { response_code_role, message_role } = state.Role;
  return {
    option_permission,
    list_permission,
    response_code_role,
    message_role,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateRole,
      readPermission,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(EditRole);
