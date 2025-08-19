import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function EditMember() {
  const location = useLocation()

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const params = new URLSearchParams(location.search)
  const id = params.get('id')

  const initialValues = {
    userName: '',
    password: '',
    provider: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    dob: '',
    point: '',
    pointUsed: '',
    // UI-only fields
    shippingAddress: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    sapCustomerCode: '',
    sapCCCode: '',
    sapTaxCode: '',
    sapCustomerIdCode: '',
    supportStaff: [],
    approvalStatus: 'pending',
    accountStatus: 'active',
  }

  // keep a copy for reinitializing Formik after fetch
  const [formInit, setFormInit] = useState(initialValues)

  const validationSchema = Yup.object({
    // title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    // pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    // metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    // metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    // visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  const fetchDataById = async () => {
    try {
      const response = await axiosClient.get(`/admin/member/${id}/edit`)
      const data = response.data.member
      if (data) {
        setFormInit((prev) => ({
          ...prev,
          userName: data?.username || '',
          fullName: data?.full_name || '',
          provider: data?.provider || '',
          email: data?.email || '',
          phone: data?.phone || '',
          address: data?.address || '',
          gender: data?.gender == 'female' ? 'Nữ' : 'Nam',
          dob: data?.dateOfBirth || '',
          point: response?.data?.orderPoints ?? '',
          pointUsed: response?.data?.accumulatedPoints ?? '',
        }))
      } else {
        console.error('No data found for the given ID.')
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data id member is error', error.message)
    }
  }

  useEffect(() => {
    // gọi để kiểm tra quyền và lấy dữ liệu, sẽ reinitialize form khi có dữ liệu
    if (id) {
      fetchDataById()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axiosClient.put(`/admin/member/${id}`, {
        // username: values.userName,
        fullname: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
        dateOfBirth: values.dob,
      })

      if (response.data.status === true) {
        toast.success('Cập nhật thông tin thành công')
      } else if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
        toast.error('Bạn không có quyền thực hiện hành động này')
      } else {
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    } catch (e) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CContainer>
      {!isPermissionCheck ? (
        <div className="text-danger">Bạn không có quyền truy cập trang này.</div>
      ) : (
        <>
          <CRow className="mb-3">
            <CCol>
              <h3>CẬP NHẬT THÀNH VIÊN</h3>
            </CCol>
            <CCol md={{ span: 4, offset: 4 }}>
              <div className="d-flex justify-content-end">
                <Link to={`/member`}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <Formik
              initialValues={formInit}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <CCard className="mb-4 shadow-sm" style={{ borderRadius: 10 }}>
                    <CCardHeader className="bg-light fw-semibold">
                      Thông tin khách hàng & Giao hàng
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="g-4">
                        {/* Thông tin khách hàng */}
                        <CCol md={6}>
                          <h6 className="mb-3">Thông tin khách hàng</h6>
                          <div className="mb-3">
                            <label htmlFor="userName-input">Tên đăng nhập</label>
                            <Field name="userName">
                              {({ field }) => (
                                <CFormInput
                                  {...field}
                                  disabled
                                  type="text"
                                  id="userName-input"
                                  placeholder="Tên đăng nhập"
                                />
                              )}
                            </Field>
                            <ErrorMessage name="userName" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="password-input">Mật khẩu</label>
                            <Field
                              name="password"
                              type="password"
                              as={CFormInput}
                              id="password-input"
                              placeholder="Đổi mật khẩu (tuỳ chọn)"
                            />
                            <small className="text-muted">
                              Tối thiểu 6 ký tự. Để trống để giữ mật khẩu cũ.
                            </small>
                            <ErrorMessage name="password" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="provider-input">Hình thức đăng nhập</label>
                            <Field
                              name="provider"
                              type="text"
                              as={CFormInput}
                              id="provider-input"
                              disabled
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="fullName-input">Họ tên</label>
                            <Field
                              name="fullName"
                              type="text"
                              as={CFormInput}
                              id="fullName-input"
                            />
                            <ErrorMessage name="fullName" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="gender-input">Giới tính</label>
                            <Field
                              as={CFormSelect}
                              name="gender"
                              id="gender-input"
                              options={[
                                { label: 'Nam', value: 'Nam' },
                                { label: 'Nữ', value: 'Nữ' },
                              ]}
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="dob-input">Ngày sinh</label>
                            <Field
                              name="dob"
                              type="text"
                              as={CFormInput}
                              id="dob-input"
                              placeholder="DD/MM/YYYY"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="email-input">Thư điện tử</label>
                            <Field name="email" type="text" as={CFormInput} id="email-input" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="phone-input">Điện thoại</label>
                            <Field name="phone" type="text" as={CFormInput} id="phone-input" />
                          </div>
                        </CCol>

                        {/* Thông tin nhận hàng */}
                        <CCol md={6}>
                          <h6 className="mb-3">Thông tin nhận hàng</h6>
                          <div className="mb-3">
                            <label htmlFor="address-input">Địa chỉ nhận hàng</label>
                            <Field name="address" type="text" as={CFormInput} id="address-input" />
                            <ErrorMessage name="address" component="div" className="text-danger" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="shippingAddress-input">Ghi chú giao hàng</label>
                            <Field
                              name="shippingAddress"
                              as={CFormTextarea}
                              id="shippingAddress-input"
                              rows={4}
                              placeholder="Ghi chú giao hàng (tuỳ chọn)"
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="point-input">Điểm tích luỹ</label>
                            <Field name="point" type="text" as={CFormInput} id="point-input" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="pointUsed-input">Điểm đã sử dụng</label>
                            <Field
                              name="pointUsed"
                              type="text"
                              as={CFormInput}
                              id="pointUsed-input"
                            />
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>

                  <CCard className="mb-4 shadow-sm" style={{ borderRadius: 10 }}>
                    <CCardHeader className="bg-light fw-semibold">
                      Thông tin công ty & Đồng bộ SAP
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="g-4">
                        {/* Thông tin công ty */}
                        <CCol md={6}>
                          <h6 className="mb-3">Thông tin công ty</h6>
                          <div className="mb-3">
                            <label htmlFor="companyName-input">Tên Công Ty</label>
                            <Field name="companyName" as={CFormInput} id="companyName-input" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="companyAddress-input">Địa chỉ Công Ty</label>
                            <Field
                              name="companyAddress"
                              as={CFormInput}
                              id="companyAddress-input"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="companyEmail-input">Email Công Ty</label>
                            <Field name="companyEmail" as={CFormInput} id="companyEmail-input" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="companyPhone-input">Số Điện Thoại Công Ty</label>
                            <Field name="companyPhone" as={CFormInput} id="companyPhone-input" />
                          </div>
                        </CCol>

                        {/* Thông tin đồng bộ SAP */}
                        <CCol md={6}>
                          <h6 className="mb-3">Thông tin đồng bộ SAP</h6>
                          <div className="mb-3">
                            <label htmlFor="sapCustomerCode-input">Mã Khách Hàng SAP</label>
                            <Field
                              name="sapCustomerCode"
                              as={CFormInput}
                              id="sapCustomerCode-input"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="sapCCCode-input">Mã CC*</label>
                            <Field name="sapCCCode" as={CFormInput} id="sapCCCode-input" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="sapTaxCode-input">Mã Số Thuế</label>
                            <Field name="sapTaxCode" as={CFormInput} id="sapTaxCode-input" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="sapCustomerIdCode-input">
                              Mã Khách Hàng Định Danh*
                            </label>
                            <Field
                              name="sapCustomerIdCode"
                              as={CFormInput}
                              id="sapCustomerIdCode-input"
                            />
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>

                  <CCard className="mb-4 shadow-sm" style={{ borderRadius: 10 }}>
                    <CCardHeader className="bg-light fw-semibold">
                      Nhân viên support khách hàng
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
                        {[
                          'NGUYỄN CHÍ ĐẠO',
                          'PHẠM ĐỖ THANH Mr.THẾ',
                          'Ms Lê Ngọc Thanh Vi',
                          'MR TRẦN NGỌC HẢI',
                          'ĐỖ MINH KHÁNH',
                          'Huỳnh Nhật Long',
                          'HỒ MINH TÂN',
                          'TRỊNH HOÀI THƯƠNG',
                          'Ms. Chi',
                          'BÙI MINH SANG',
                          'Thiên-KDS52',
                          'NGUYỄN THỊ KIM OANH',
                          'NGUYỄN HỮU SINH',
                          'Mr. Hoàng Minh',
                          'Mr. Tuấn An',
                        ].map((name, idx) => (
                          <CCol key={idx}>
                            <CFormCheck
                              id={`staff_${idx}`}
                              label={name}
                              checked={values.supportStaff?.includes(name)}
                              onChange={(e) => {
                                const checked = e.target.checked
                                const current = new Set(values.supportStaff || [])
                                if (checked) current.add(name)
                                else current.delete(name)
                                setFieldValue('supportStaff', Array.from(current))
                              }}
                            />
                          </CCol>
                        ))}
                      </CRow>
                    </CCardBody>
                  </CCard>

                  <CCard className="mb-4 shadow-sm" style={{ borderRadius: 10 }}>
                    <CCardHeader className="bg-light fw-semibold">Kích hoạt tài khoản</CCardHeader>
                    <CCardBody>
                      <CRow className="g-3">
                        <CCol md={6}>
                          <label htmlFor="approvalStatus-select">Trạng thái duyệt</label>
                          <Field
                            name="approvalStatus"
                            as={CFormSelect}
                            id="approvalStatus-select"
                            options={[
                              { label: 'Chờ kích hoạt', value: 'pending' },
                              { label: 'Đã duyệt', value: 'approved' },
                              { label: 'Từ chối', value: 'rejected' },
                            ]}
                          />
                        </CCol>
                        <CCol md={6}>
                          <label htmlFor="accountStatus-select">Trạng thái hoạt động</label>
                          <Field
                            name="accountStatus"
                            as={CFormSelect}
                            id="accountStatus-select"
                            options={[
                              { label: 'Đang hoạt động', value: 'active' },
                              { label: 'Bị khóa', value: 'locked' },
                            ]}
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>

                  <div className="d-flex gap-2">
                    <CButton color="primary" type="submit" size="sm" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <CSpinner size="sm" /> Đang cập nhật...
                        </>
                      ) : (
                        'Cập nhật'
                      )}
                    </CButton>
                  </div>
                </Form>
              )}
            </Formik>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default EditMember
