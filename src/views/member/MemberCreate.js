import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CAlert,
  CSpinner,
} from '@coreui/react'
import { axiosClient_NK } from '../../axiosConfig'

function MemberCreate() {
  const [customerCode, setCustomerCode] = useState('')
  const [accountInfo, setAccountInfo] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setAccountInfo(null)

    if (!customerCode.trim()) {
      setError('Vui lòng nhập mã khách hàng')
      return
    }

    try {
      setIsLoading(true)
      const response = await axiosClient_NK.post('/update-user-password', {
        MaKH: customerCode.trim(),
      })

      if (response?.data?.status === true) {
        const data = {
          username: response.data.username,
          password: response.data.password,
          maKH: response.data.MaKH,
        }
        setAccountInfo(data)
      } else {
        setError(response?.data?.message || 'Không tạo được tài khoản. Vui lòng thử lại.')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!accountInfo) return
    const textToCopy = `Username: ${accountInfo.username}\nPassword: ${accountInfo.password}`
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert('Thông tin đã được sao chép!'))
      .catch(() => alert('Sao chép thất bại, vui lòng thử lại.'))
  }

  const handleReset = () => {
    setCustomerCode('')
    setAccountInfo(null)
    setError(null)
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol className="text-center">
          <h3>TẠO TÀI KHOẢN WEBSITE</h3>
        </CCol>
      </CRow>

      <CRow className="justify-content-center">
        <CCol md={8} lg={6}>
          <CCard>
            <CCardHeader>Tạo tài khoản</CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CFormLabel htmlFor="customerCode">Mã khách hàng</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>Mã KH</CInputGroupText>
                  <CFormInput
                    id="customerCode"
                    type="text"
                    placeholder="Nhập mã khách hàng (ví dụ: KH0001)"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    autoComplete="off"
                  />
                </CInputGroup>

                <div className="d-flex gap-2 mt-3">
                  <CButton size="sm" type="submit" color="primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <CSpinner size="sm" /> Đang tạo...
                      </>
                    ) : (
                      'Tạo tài khoản'
                    )}
                  </CButton>
                  <CButton
                    size="sm"
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={handleReset}
                  >
                    Xóa nhập
                  </CButton>
                </div>
              </CForm>

              {error && (
                <CAlert color="danger" className="mt-3 mb-0">
                  {error}
                </CAlert>
              )}

              {accountInfo && (
                <div className="mt-3">
                  <CAlert color="success" className="mb-2">
                    <div>
                      Mã Khách hàng: <strong>{accountInfo.maKH}</strong>
                    </div>
                    <div>
                      Username: <code>{accountInfo.username}</code>
                    </div>
                    <div>
                      Password: <code>{accountInfo.password}</code>
                    </div>
                  </CAlert>
                  <CButton size="sm" color="secondary" onClick={handleCopy}>
                    Sao chép thông tin
                  </CButton>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default MemberCreate
