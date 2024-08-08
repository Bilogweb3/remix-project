import React, { useEffect, useState, useContext, Fragment } from 'react'
import './ContractDropdown.css'
import { AppContext } from '../AppContext'

export interface ContractDropdownSelection {
  triggerFilePath: string
  filePath: string
  contractName: string
}

interface ContractDropdownProps {
  label: string
  id: string
  selectedContract: ContractDropdownSelection
  setSelectedContract: (selection: ContractDropdownSelection) => void
}

// Chooses one contract from the compilation output.
export const ContractDropdown: React.FC<ContractDropdownProps> = ({ label, id, selectedContract, setSelectedContract }) => {
  const { compilationOutput } = useContext(AppContext)

  useEffect(() => {
    if (!compilationOutput || !!selectedContract) return
    // Otherwise select the first by default
    const triggerFilePath = Object.keys(compilationOutput)[0]
    const contracts = compilationOutput[triggerFilePath]?.data?.contracts
    if (contracts && Object.keys(contracts).length) {
      const firstFilePath = Object.keys(contracts)[0]
      const contractsInFile = contracts[firstFilePath]
      if (contractsInFile && Object.keys(contractsInFile).length) {
        const firstContractName = Object.keys(contractsInFile)[0]
        setSelectedContract({ triggerFilePath, filePath: firstFilePath, contractName: firstContractName })
      }
    }
  }, [compilationOutput])

  const handleSelectContract = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContract(JSON.parse(event.target.value))
  }

  const hasContracts = compilationOutput && Object.keys(compilationOutput).length > 0

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select value={selectedContract ? JSON.stringify(selectedContract) : ''} className={`form-control custom-select pr-4 ${!hasContracts ? 'disabled-cursor' : ''}`} id={id} disabled={!hasContracts} onChange={handleSelectContract}>
        {hasContracts ? (
          Object.keys(compilationOutput).map((compilationTriggerFileName) => (
            <optgroup key={compilationTriggerFileName} label={`[Compilation Trigger File]: ${compilationTriggerFileName}`}>
              {Object.keys(compilationOutput[compilationTriggerFileName].data.contracts).map((fileName) => (
                <Fragment key={`${compilationTriggerFileName}:${fileName}`}>
                  <option disabled value={`${compilationTriggerFileName}:${fileName}`} style={{ fontWeight: 'bold' }}>
                    [File]: {fileName}
                  </option>
                  {Object.keys(compilationOutput[compilationTriggerFileName].data.contracts[fileName]).map((contractName) => {
                    const value = JSON.stringify({ triggerFilePath: compilationTriggerFileName, filePath: fileName, contractName: contractName })
                    return (
                      <option key={`${compilationTriggerFileName}:${fileName}:${contractName}`} value={value}>
                        {'\u00A0\u00A0\u00A0' + contractName} {/* Indentation for contract names */}
                      </option>
                    )
                  })}
                </Fragment>
              ))}
            </optgroup>
          ))
        ) : (
          <option>No Compiled Contracts. Please compile and select a contract</option>
        )}
      </select>
    </div>
  )
}
