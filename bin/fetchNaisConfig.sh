#!/bin/bash -e

# output color
RED='\033[0;31m'
GREEN='\033[0;32m'
NO_COLOR='\033[0m'

if [ -z "${MONOREPO_BASE_URL}" ]; then
  echo -e "${RED}[error] must be set: MONOREPO_BASE_URL${NO_COLOR}"
  echo -e ""
  exit 1
fi

MONOREPO_COMMIT_HASH=`cat MONOREPO`
if [ -z "${MONOREPO_COMMIT_HASH}" ]; then
  echo -e "${RED}[error] Failed to extract monorepo commit hash${NO_COLOR}"
  echo -e ""
  exit 1
fi

SCRIPT=$0
function usage {
  echo -e "Usage: ${SCRIPT} <environment> <target-dir>"
  echo -e ""
  echo -e "Options:"
  echo -e "  - environment\t\tprod|dev|dev-delingslenke"
  echo -e ""
}

FILE=$1
if [ -z "${FILE}" ]; then
  echo -e "${RED}[error] missing environment${NO_COLOR}"
  echo -e ""
  usage
  exit 1
fi

TARGET_DIR=$2
if [ -z "${TARGET_DIR}" ]; then
  echo -e "${RED}[error] missing target-dir${NO_COLOR}"
  echo -e ""
  usage
  exit 1
fi

echo -e "-----------------------------------------------------------"
echo -e "\t${GREEN}Fetching NAIS config files: FILE${NO_COLOR}"
echo -e "-----------------------------------------------------------"

FYLLUT_NAIS_URL="${MONOREPO_BASE_URL}/${MONOREPO_COMMIT_HASH}/.nais/fyllut"

echo -e "${GREEN}Fetching files:${NO_COLOR}"
echo -e "- config.yaml"
echo -e "- ${FILE}.yaml"
echo -e ""

mkdir ${TARGET_DIR} || true
cd ${TARGET_DIR}
wget -O config.yaml "${FYLLUT_NAIS_URL}/config.yaml"
wget -O ${FILE}.yaml "${FYLLUT_NAIS_URL}/${FILE}.yaml"
cd ..
